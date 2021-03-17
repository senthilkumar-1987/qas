const pdfMakePrinter = require('pdfmake');
/* var pdfMake = require('./pdfmake'); */
var fs = require('fs');
// var pdfFonts = require('./VFS_FONTS');
const InvoicePDFRepo = require('../../cc/InvoicePDFRepo');
var path = require('path');
var blobStream = require('blob-stream');
var fontDir = path.join(__dirname + '/fonts1/verdana');
var imageDir = path.join(__dirname + '/images');
var dateFormat = require('dateformat');

let filename = "test";
// Stripping special characters
filename = encodeURIComponent(filename) + '.pdf'

// Define font files
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

exports.generateInvoicePDFService = async (req, res) => {

    let resObj = {};
    let inputData = req.body;
    let coy_id = inputData.POM_S_COY_ID;
    let bcoyid = inputData.POM_B_COY_ID;
    let Invno = inputData.IM_INVOICE_NO;
    let sessionObj = req.userData;
    previewINV = await InvoicePDFRepo.generateINVPDF(sessionObj, coy_id, bcoyid, Invno);

    console.log("previewINV==>" + JSON.stringify(previewINV))

    resObj.streamData = await this.pdfgenerate(previewINV);

    resObj.docName = inputData.IM_INVOICE_NO;

    return resObj;

}


exports.pdfgenerate = async (dataList) => {
    let data = dataList[0];
    let str = data.IM_YOUR_REF;
    var partsOfStr = str.split(',');
    let subTotal = 0;
    let serviceTotalAmt = 0;
    let grandTotal = 0;


    console.log("Length=>" + JSON.stringify(dataList));

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
                            image: imageDir + '/prudential-logo.jpg',
                            width: 90
                        },
                        {
                            text: [
                                { text: ' \n Invoice       ', bold: true, style: 'header', fontSize: 20, alignment: 'center' },
                            ],
                        }
                    ]
                },
                {
                    margin: 20,
                    columns: [
                        {
                            text: [
                                { text: (data.POM_S_COY_NAME), style: 'header', fontSize: 8, },
                                '\n' + (data.POM_S_ADDR_LINE1), '\n' + (data.POM_S_ADDR_LINE2), '\n' + (data.POM_S_POSTCODE + "" + "   " + " " + data.POM_S_CITY), '\n' + (data.POM_S_STATE + " " + data.SupplierAddrCtry),
                                '\nBusiness Reg. No :   ', { text: (data.CM_BUSINESS_REG_NO) + '\n', fontSize: 8 },
                                'Buyer Name        :   ', { text: (data.POM_BUYER_NAME) + '\n', fontSize: 8 },
                                'Tel                      :  ', { text: (data.POM_S_PHONE) + '\n', fontSize: 8 },
                                { text: 'Email                  :  ' }, { text: (data.POM_S_EMAIL) + '\n', fontSize: 8 },

                            ]
                        },
                        {
                            style: 'tableExample',
                            table: {
                                widths: ['auto', 'auto', 'auto'],
                                body: [

                                    [{ text: 'Invoice No. ', bold: true, }, ':', { text: (data.IM_INVOICE_NO), bold: true, }],
                                    [{ text: 'Date', bold: true }, ':', { text: (dateFormat(data.GM_CREATED_DATE, "dd/mm/yyyy")) }],
                                    [{ text: 'Payment Terms', bold: true }, ':', { text: (data.POM_PAYMENT_TERM) }],
                                    [{ text: 'Payment Method', bold: true, }, ':', { text: (data.POM_PAYMENT_METHOD), }],
                                    [{ text: 'Shipment Terms  ', bold: true, }, ':', { text: (data.POM_SHIPMENT_TERM) }],
                                    [{ text: 'Shipment Mode', bold: true, }, ':', { text: (data.POM_SHIPMENT_MODE) }],
                                    [{ text: 'Our Ref. No.', bold: true, }, ':', { text: (data.IM_OUR_REF ? data.IM_OUR_REF : 'N/A') }],
                                    [{ text: 'Your Ref.', bold: true, }, ':', { text: (partsOfStr[0] + '\n' + partsOfStr[1] + '\n' + partsOfStr[2]) }],

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



exports.NullCheck = async (data) => {
    let N;


    if (data == null || data == 'null' || data == '') {
        N = "N/A";
    } else {
        N = data;
    }

    return N;

}


