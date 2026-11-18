import { Buffer } from "buffer";
(globalThis as unknown as { Buffer: typeof Buffer }).Buffer = Buffer;
type WorkerRequest = { buffer: ArrayBuffer };
self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  try {
    const bytes = new Uint8Array(event.data.buffer);
    const signature = [208, 207, 17, 224, 161, 177, 26, 225];
    if (!signature.every((b, i) => bytes[i] === b))
      throw new Error("This is not a supported Outlook .msg file.");
    if (bytes.byteLength > 50 * 1024 * 1024)
      throw new Error("Choose a file smaller than 50 MiB.");
    const { default: MsgReader } = await import("@kenjiuno/msgreader");
    const Constructor =
      (MsgReader as unknown as { default?: typeof MsgReader }).default ??
      MsgReader;
    const reader = new Constructor(event.data.buffer);
    const data = reader.getFileData();
    if (data.error)
      throw new Error(
        "This email could not be read. Try saving it again as an Outlook .msg file.",
      );
    const images: { name: string; mime: string; data: Uint8Array }[] = [];
    for (const attachment of data.attachments || []) {
      const name = attachment.fileName || attachment.fileNameShort || "";
      const extension = name.toLowerCase().split(".").pop();
      if (
        !extension ||
        !["png", "jpg", "jpeg", "gif", "webp"].includes(extension) ||
        (attachment.contentLength || 0) > 10 * 1024 * 1024
      )
        continue;
      const content = reader.getAttachment(attachment);
      if (content?.content?.length)
        images.push({
          name,
          mime: extension === "jpg" ? "image/jpeg" : `image/${extension}`,
          data: new Uint8Array(content.content),
        });
    }
    self.postMessage({
      ok: true,
      subject: data.subject || "Newsletter",
      text: data.body || "",
      html:
        data.bodyHtml || (data.html ? new TextDecoder().decode(data.html) : ""),
      images,
    });
  } catch (error) {
    self.postMessage({
      ok: false,
      error:
        error instanceof Error ? error.message : "Unable to read this file.",
    });
  }
};
