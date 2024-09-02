export function readBlobAsDataURL(blob: Blob) {
  return new Promise<string>((resolve) => {
    var a = new FileReader();
    a.onload = (e) => {
      if (e.target) {
        resolve(e.target.result as string);
      }
    };
    a.readAsDataURL(blob);
  });
}
