export function removeExtensionName(fileName: string): string {

    const removeExtensionRegex = /\.[^/.]+$/;

    const newFileName: string = fileName.replace(removeExtensionRegex, "");

    return newFileName;

}