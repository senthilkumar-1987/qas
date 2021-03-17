const ReciptPdf = require('../../PDFUtils/MasterPDF/ReciptPdf');
const responseDto = require('../../config/ResponseDto')
exports.downloadReceiptdf = async (req, res) => {
    try {
        console.log("downloadmasterpdf" + JSON.stringify(req.body))

        let resObj = await ReciptPdf.generateReceiptPdf(req.body.InvoiceNo, req, res)
        res.writeHead(200, {
            "Content-Type": "application/pdf",
            'Content-disposition': 'attachment; filename=' + resObj.docName + '.pdf'
        });
        resObj.streamData.pipe(res);
    }

    catch (err) {
        console.log(err);
        // return res.json(new responseDto(constants.STATUS_FAIL, constants.STATUS_FAIL, err));
    }
}