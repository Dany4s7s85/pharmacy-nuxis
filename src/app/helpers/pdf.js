import jsPdf from "jspdf";
import html2canvas from "html2canvas";

export const printPDF = (ref) => {
  const domElement = ref.current;
  html2canvas(domElement, {
    onclone: (document) => {
      // document.getElementById("print").style.visibility = "hidden";
    },
  }).then((canvas) => {
    let pdf = new jsPdf("p", "mm", "a4");
    var imgWidth = 208;
    var imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL("image/png");
    var position = 0;
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    // const pdfURL = pdf.output('bloburi');
    pdf.save("adsdas.pdf");
  });
};
