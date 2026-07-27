export function getDocumentIcon(fileType: string): string {
  if (fileType.startsWith("image/")) return "ti-photo";
  if (fileType === "application/pdf") return "ti-file-type-pdf";
  if (fileType.includes("word")) return "ti-file-type-doc";
  return "ti-file-text";
}
