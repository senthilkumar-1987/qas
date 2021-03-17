let invoiceRepo = require('../../repositories/InvoiceRepository/invoiceRepo');
let invoiceDetails = require('../../repositories/PaymentRepository/InvoiceDetails');
let generateInvoice = require('../../repositories/PaymentRepository/GenerateInvoiceLogic');
let responseDto = require('../../config/ResponseDto')
var PDFDocument = require('pdfkit');
var fs = require('fs');
var pdfUtil = require('../../PDFUtils/PdfKitUtils')
var stream = require('stream');
var constants = require('../../config/PaymentConstants');
const pdfMakePrinter = require('pdfmake');
/* var pdfMake = require('./pdfmake'); */

// var pdfFonts = require('./VFS_FONTS');

var path = require('path');
var blobStream = require('blob-stream');
var fontDir = path.join(__dirname + '/fonts1/verdana');
var imageDir = path.join(__dirname + '/images');
var dateFormat = require('dateformat');

let sirimIcon = __dirname + '/images/Sirim_Invoice_Icon.jpg';
let invoiceJsonData = {}
let invoiceCustomerDetails = {};
const jsonFilePath = __dirname + '/Pdf-Json-Format.json';
let Qutationdata = {};
const jsoncustomerInfo = __dirname + '/Invoice-InputData.json';
const qutationInfo = __dirname + '/Quotation-inpuData.json';
fs.readFile(jsonFilePath, 'utf-8', (err, data) => {
    if (err) throw err

    invoiceJsonData = JSON.parse(data);

})

fs.readFile(qutationInfo, 'utf-8', (err, data) => {
    if (err) throw err


    Qutationdata = JSON.parse(data);
    // console.log(data);

})

var fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
};

var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
var fs = require('fs');
async function thisThrows() {
    throw new Error("Thrown from thisThrows()");
}

fs.readFile(jsoncustomerInfo, 'utf-8', (err, data) => {
    if (err) throw err

    invoiceCustomerDetails = JSON.parse(data);

})

let loadInvoiceDetails = async (req, res) => {
    try {

        let resultQutationDetails = await invoiceDetails.Load_Invoice_Details(req.userData)
        // console.log(resultQutationDetails)

        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultQutationDetails));


    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}

let loadInVoiceDetailsByQuotationId = async (req, res) => {
    try {
        var QuotationDetails = req.body;

        let resultInvoiceDetails = await invoiceDetails.Load_Invoice_Details_ById(QuotationDetails).catch((e) => {
            console.log(e);
        });
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultInvoiceDetails));
    }
    catch (err) {
        console.log(err);

        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}



let generateInvoiceNo = async (req, res) => {
    let responseObj = {};
    var response = '';
    try {
        // console.log(req.body)        

        var QuotationDetails = req.body.datas;

        var transactionAmount = req.body.transactionAmount
        console.log(QuotationDetails);

        //        console.log("resultInvoiceSeq"+resultInvoiceSeq);

        // console.log(QuotationDetails[i].Qutation_no);
        //console.log(QuotationDetails[i].Quotation_no)

        /*   QuotationDetails.forEach(async element => {
              
             await generateInvoice.Generate_Invoice_No(element.Quotation_no, resultInvoiceSeq,transactionAmount)
          }); */
        if (QuotationDetails.length == 1) {
            try {
                // let title =QuotationDetails.companyName;
                let title = 'sirim';
                let doc = new PDFDocument({ margin: 50 });

                res.setHeader('Content-disposition', 'attachment; filename=osr.pdf');
                res.setHeader('Content-type', 'application/pdf');

                await pdfUtil.generateHeader(doc);
                await pdfUtil.generateCustomerInformation(doc, invoiceCustomerDetails);
                await pdfUtil.generateInvoiceTable(doc, invoiceCustomerDetails);
                writeStream = fs.createWriteStream(title + '.pdf');
                doc.pipe(writeStream);
                doc.end()
                writeStream.on('finish', async function () {

                    let mailResults = await generateInvoice.MAIL_NOTIFICATION_FOR_CUSTOMER_INVOICE_INFO(QuotationDetails).catch((e) => {
                        console.log("Finished")
                        responseObj.message = e
                    });
                });

            } catch (err) {
                console.log(err);
                return res.json(new responseDto('', constants.STATUS_FAIL, err));
            }
            finally {


            }
        }
        else {


            // this.pdfgenerate(QuotationDetails, resultInvoiceSeq);
        }

        return res.json(new responseDto(constants.STATUS_SUCCESS, '', resultInvoiceSeq));
    }


    catch (err) {
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    }
}
exports.pdfgenerate = async (dataList, invoiceNo) => {
    console.log(dataList);
    let data = dataList[0];
    let str = data.IM_YOUR_REF;
    var partsOfStr = str.split(',');
    let subTotal = 0;
    let serviceTotalAmt = 0;
    let grandTotal = 0;


    // console.log("Length=>" + JSON.stringify(dataList));

    var fonts = {
        Courier: {
            normal: 'Courier',
            bold: 'Courier-Bold',
            italics: 'Courier-Oblique',
            bolditalics: 'Courier-BoldOblique'
        },
        Helvetica: {
            normal: 'Helvetica',
            bold: 'Helvetica-Bold',
            italics: 'Helvetica-Oblique',
            bolditalics: 'Helvetica-BoldOblique'
        },
        Times: {
            normal: 'Times-Roman',
            bold: 'Times-Bold',
            italics: 'Times-Italic',
            bolditalics: 'Times-BoldItalic'
        },
        Symbol: {
            normal: 'Symbol'
        },
        ZapfDingbats: {
            normal: 'ZapfDingbats'
        },
        Verdana: {
            normal: fontDir + '/verdana.ttf',
            bold: fontDir + '/Verdana Bold.ttf'

        }
    };

    var PdfPrinter = require('pdfmake');
    var printer = new PdfPrinter(fonts);
    var fs = require('fs');


    var temp = [];

    let itemListHeader = [{ text: '\nLine', style: 'tableHeader', bold: true, alignment: 'center' }, { text: '\n Item Description', style: 'tableHeader', bold: true }, { text: '\n UOM', style: 'tableHeader', bold: true, alignment: 'center' }, { text: '\n QTY ', style: 'tableHeader', bold: true }, { text: '\n Unit Price (MYR) ', style: 'tableHeader', bold: true, alignment: 'center' }, { text: '\n Amount (MYR)', style: 'tableHeader', bold: true, alignment: 'center' }, { text: '\n Tax (MYR)', style: 'tableHeader', bold: true, alignment: 'center' }, { text: '\nW.T. (Months)', style: 'tableHeader', bold: true, alignment: 'center' }];
    temp.push(itemListHeader);


    let shipTos = [{ text: '', fontSize: 8, bold: true, colSpan: 8 }]
    temp.push(shipTos);

    for (let index = 0; index < dataList.length; index++) {
        const element = dataList[index];
        let columnWidth = 'width:auto';

        subTotal = element.IM_INVOICE_TOTAL;
        shipment = element.IM_SHIP_AMT;
        serviceTotalAmt = Number(serviceTotalAmt) + Number(shipment);
        grandTotal = subTotal + serviceTotalAmt;

        let records = [{ text: index + 1, alignment: 'center' }, { text: element.POD_PRODUCT_DESC }, { text: element.POD_UOM, alignment: 'center' }, { text: (element.ID_RECEIVED_QTY).toFixed(2), columnWidth, alignment: 'center' }, { text: (element.ID_UNIT_COST).toFixed(2), alignment: 'center' }, { text: (element.IM_INVOICE_TOTAL).toFixed(2), alignment: 'center' }, { text: (element.ID_GST).toFixed(2), alignment: 'center' }, { text: (element.ID_WARRANTY_TERMS), alignment: 'center' }];

        temp.push(records);
        let remarkss = [{ text: "", colSpan: 8, bold: true }];

        temp.push(remarkss);

        let remarkssw = [{ text: "", colSpan: 8, bold: true }];

        temp.push(remarkssw);


        //let remarks = [{ text: "Remarks : " + element.GD_REMARKS, colSpan: 9 }];

        // temp.push(remarks);
        /*     let ss1 = [{ text: element.POD_PRODUCT_DESC }];
            let ss2 = [{ text: element.POD_UOM }];
            let ss3 = [{ text: element.POD_WARRANTY_TERMS }]; */



    }

    console.log(' Length --> ' + temp.length);

    console.log("itemssss" + JSON.stringify(temp) + ' ' + temp.length);
    const line = { type: 'line', x1: 0, y1: 10, x2: 590, y2: 10, lineWidth: 1.0, lineColor: '#000000' };

    var docDefinition = {
        content: [
            {
                style: ' tableExample', margin: [-18, 0, 10, 0],
                table: {
                    headerRows: 1,
                    body: temp
                },
                layout: 'headerLineOnly'
            },



            {
                style: 'tableExample', margin: [370, 0, -40, 0],
                table: {
                    headerRows: 1,
                    body: [

                        ["", "", ""],
                        [{ text: 'Sub Total ', border: [false, false, false, false], style: 'subheader', bold: true, alignment: 'right' }, { text: ':', border: [false, false, false, false], style: 'subheader', bold: true }, { text: (subTotal).toFixed(2), border: [false, false, false, false], style: 'subheader', bold: true, alignment: 'right' }],
                        [{ text: ' Tax ', border: [false, false, false, false], style: 'subheader', bold: true, alignment: 'right' }, { text: ':', border: [false, false, false, false], style: 'subheader', bold: true }, { text: (serviceTotalAmt).toFixed(2), border: [false, false, false, false], style: 'subheader', bold: true, alignment: 'right' }],
                        [{ text: 'Shipping & Handling', border: [false, false, false, false], style: 'subheader', bold: true, alignment: 'right' }, { text: ':', border: [false, false, false, false], style: 'subheader', bold: true }, { text: (shipment).toFixed(2), border: [false, false, false, false], style: 'subheader', bold: true, alignment: 'right' }],
                        [{ text: 'Grand Total', border: [false, true, false, true], style: 'subheader', bold: true, alignment: 'right' }, { text: ':', border: [false, true, false, true], style: 'subheader', bold: true }, { text: (subTotal + serviceTotalAmt).toFixed(2), border: [false, true, false, true], style: 'subheader', bold: true, alignment: 'right' }],


                    ]
                },
                layout: {
                    hLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.body.length) ? 2 : 1;
                    },
                    vLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                    },
                    hLineColor: function (i, node) {
                        return 'black';
                    },
                    vLineColor: function (i, node) {
                        return 'black';
                    },

                    // paddingLeft: function(i, node) { return 4; },
                    // paddingRight: function(i, node) { return 4; },
                    // paddingTop: function(i, node) { return 2; },
                    // paddingBottom: function(i, node) { return 2; },
                    // fillColor: function (i, node) { return null; }
                }, layout: {
                    defaultBorder: false,
                }
            },


        ],
        styles: {
            header: {
                bold: true,
                fontSize: 15
            },
        },
        defaultStyle: {
            font: 'Verdana',
            fontSize: 8
        },
        pageMargins: [40, 330, 40, 60],
        header: function (currentPage, pageCount) {
            return [
                {
                    margin: 10,
                    columns: [
                        {
                            image: imageDir + '/Sirim_Invoice_Icon.jpg',
                            width: 50
                        },
                        {
                            text: [
                                { text: ('SIRIM QAS International Sdn Bhd'), style: 'header', fontSize: 8, },
                                '\n' + ('Company No. 410334-X'), '\n' + ('No.1 Persiaran Dato Menteri, Section 2, P.O.Box 7035'), '\n' + ('40700 Shah Alam Selangor'), '\n' + ('Tel : 603 5544 6400	Fax : 603 5544 5672 '),
                                { text: ('Toll Free : 1-300-88-7035 www.sirim-qas.com.my') + '\n', fontSize: 8 },
                                { text: ('Services Tax ID: B16-1809-32001048') + '\n', fontSize: 8 },


                            ],
                        }
                    ]
                },
                {
                    margin: 20,
                    columns: [
                        {
                            text: [[{ text: 'Date', bold: true }, ':', { text: (dateFormat(data.GM_CREATED_DATE, "dd/mm/yyyy")) }],
                            [{ text: 'Payment Terms', bold: true }, ':', { text: (data.POM_PAYMENT_TERM) }],
                            [{ text: 'Payment Method', bold: true, }, ':', { text: (data.POM_PAYMENT_METHOD), }],
                            [{ text: 'Shipment Terms  ', bold: true, }, ':', { text: (data.POM_SHIPMENT_TERM) }],
                            [{ text: 'Shipment Mode', bold: true, }, ':', { text: (data.POM_SHIPMENT_MODE) }],
                            [{ text: 'Our Ref. No.', bold: true, }, ':', { text: (data.IM_OUR_REF ? data.IM_OUR_REF : 'N/A') }],
                            [{ text: 'Your Ref.', bold: true, }, ':', { text: (partsOfStr[0] + '\n' + partsOfStr[1] + '\n' + partsOfStr[2]) }],

                            ]
                        },
                        {
                            style: 'tableExample',
                            table: {
                                widths: ['auto', 'auto', 'auto'],
                                body: [
                                    [{ text: 'ID No. ', bold: true, }, ':', { text: (data.id), bold: true, }],
                                    [{ text: 'Name. ', bold: true, }, ':', { text: (data.Company_name), bold: true, }],
                                    [{ text: 'Address. ', bold: true, }, ':', { text: (data.Manufacturer_address1) + '\n' + (data.Manufacturer_address2) + '\n' + (data.Manufacturer_address3), bold: true, }],
                                    [{ text: 'Attention. ', bold: true, }, ':', { text: (data.customer_name), }],



                                ]
                            },
                            layout: 'noBorders'
                        },

                    ]
                },
                {
                    margin: [20, -30, 50, 60],
                    columns: [
                        {
                            text: [
                                { text: 'Bill To: ', bold: true }, '\n', { text: (data.CM_COY_NAME), bold: true, style: 'header', fontSize: 8 }, { text: '\n' + (data.POM_B_ADDR_LINE1) + '\n' + (data.POM_B_ADDR_LINE2) + '\n' + (data.POM_B_ADDR_LINE3) + '\n' + (data.POM_B_POSTCODE + "  " + data.POM_B_CITY + "  " + data.SupplierAddrCtry), fontSize: 8 },
                                '\n\n\n', { text: 'Vendor Remarks :   ', bold: true }, { text: (data.IM_REMARK) }

                            ]
                        },
                        {

                        },
                    ]
                }
            ]
        },
        footer: function (currentPage, pageCount, pageSize) {
            return [
                { text: '', alignment: 'left' },
                { canvas: [Object.assign({}, line)] },
                { text: 'This is a computer generated document. No signature is required.', alignment: 'left' },
                { text: 'Page ' + currentPage + ' of ' + pageCount, alignment: 'center' },
            ]
        }
    };

    var pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(blobStream());
    pdfDoc.end();

    return pdfDoc;

}

let generateInvoices = async (req, res) => {
    /* let responseObj = {};
    var response = '';
    try {
        var QuotationDetails = req.body;

            let resultInvoiceSeq = await generateInvoice.Get_Invoice_Seq_Value();
           //  responseObj.message=e
              // return res.json(resultInvoiceSeq);
                 //   console.log(resultInvoiceSeq)
     
          let resultInvoiceDetails = await generateInvoice.GENERATE_INVOICE(QuotationDetails,resultInvoiceSeq).catch((e) => {
              console.log(e);
              responseObj.message = e
              return res.json(responseObj);
			//   return res.json(new responseDto(constants.STATUS_SUCCESS, '', "sucess"));
  
          });  
         
     try {
        
           // let title =QuotationDetails.companyName;
           let title='sirim';
            let doc = new PDFDocument({ margin: 50 });

            res.setHeader('Content-disposition', 'attachment; filename=osr.pdf');
            res.setHeader('Content-type', 'application/pdf');

            await pdfUtil.generateHeader(doc);
            await pdfUtil.generateCustomerInformation(doc, invoiceCustomerDetails);
            await pdfUtil.generateInvoiceTable(doc, invoiceCustomerDetails);
            writeStream = fs.createWriteStream(title+'.pdf');
            doc.pipe(writeStream);
            doc.end()
            writeStream.on('finish',async  function () {
               
                let mailResults = await generateInvoice.MAIL_NOTIFICATION_FOR_CUSTOMER_INVOICE_INFO(QuotationDetails).catch((e) => {
                    console.log("Finished")
                    responseObj.message = e
               
            
                });
            });

        } catch (err) {
            console.log(err);
            return res.json(new responseDto('', constants.STATUS_FAIL, err));
        }
      finally {
           
    
        }
    }
        let resultupdateDetails = await generateInvoice.update_costing_tbl(QuotationDetails);
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', "sucess"));
      }

   
    catch (err) {
        console.log(err);
        return res.json(new responseDto('', constants.STATUS_FAIL, err));
    } */
}

let getCancelledInvoiceList = async (req, res) => {
    try {

        let getCancelledInvoiceList = await invoiceRepo.getCancelledInvoiceList(req, res)
        return res.json(new responseDto(constants.STATUS_SUCCESS, '', getCancelledInvoiceList));
    }
    catch (err) {
        console.log(err);
        return res.json(new responseDto(constants.STATUS_FAIL, '', err));
    }
}

module.exports = {
    loadInvoiceDetails, loadInVoiceDetailsByQuotationId, generateInvoiceNo, getCancelledInvoiceList
}