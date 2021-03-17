var dateFormat = require('dateformat');
var path = require('path');
var blobStream = require('blob-stream');
var fontDir = path.join(__dirname + '/fonts1/verdana');
var imageDir = path.join(__dirname + '/images');
var dateFormat = require('dateformat');
var fontRobotoDir = path.join(__dirname + '/fonts1/roboto');
var PdfPrinter = require('pdfmake');
var constants = require('../config/Constants');
var badDebtRepository = require('../CronScheduler/BadDebtRepository');
var moment = require('moment');
var fs = require('fs');
// let sirimIcon = __dirname + '/images/Sirim_Invoice_Icon.jpg';
const fontss = {
    Roboto: {
        normal: fontRobotoDir + '/Roboto-Regular.ttf'
    }
};


exports.pdfgenerateSample = async (req, res) => {
    var docDefinition = {
        content: [
            'First paragraph',
            'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
        ]
    }
    var pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream('D:\\SIRIM_Latest\\13012020\\PDF Test\\myFile.pdf'));
    pdfDoc.end();
    return pdfDoc;
}


exports.pdfgenerateRemainderFirst = async (invoiceDtails) => {
    // console.log("invoiceDtails => " + JSON.stringify(invoiceDtails))
    try {
        let grandTotal = 0;
        let currencyCode = invoiceDtails[0].Currency;
        let FINANCE_DEPARTMENT = 'FINANCE DEPARTMENT';

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
        var printer = new PdfPrinter(fonts);
        var temp = [];

        let itemListHeader = [
            { text: 'No.', style: 'tableHeader', bold: true, alignment: 'center' },
            { text: 'File Number', style: 'tableHeader', bold: true, alignment: 'center' },
            { text: 'Invoice No', style: 'tableHeader', bold: true, alignment: 'center' },
            { text: 'Date ', style: 'tableHeader', bold: true, alignment: 'center' },
            { text: 'Amount ' + currencyCode, style: 'tableHeader', bold: true, alignment: 'center' },
            { text: 'Amount Paid ' + currencyCode, style: 'tableHeader', bold: true, alignment: 'center' },
            { text: 'Balance Outstanding ' + currencyCode, style: 'tableHeader', bold: true, alignment: 'center' }

        ];

        temp.push(itemListHeader);

        let shipTos = [{ text: '', fontSize: 8, bold: true, colSpan: 8 }]
        // let cityDetails = await badDebtRepository.getCityDetailsById(invoiceDtails[0].City_id);
        let stateDetails = await badDebtRepository.getStateDetailsById(invoiceDtails[0].State_id);
        // console.log("stateDetails ==>" + JSON.stringify(stateDetails))
        let countryDetails = await badDebtRepository.getCountryDetailsById(invoiceDtails[0].Country_id);
        // console.log("countryDetails ==>" + JSON.stringify(countryDetails))
        let addressDetails = await badDebtRepository.getAddressDetailsById(invoiceDtails[0].Address_Id);
        // console.log("addressDetails ==>" + JSON.stringify(addressDetails))

        for (let index = 0; index < invoiceDtails.length; index++) {
            const invoiceDtailss = invoiceDtails[index];
            let columnWidth = 'width:auto';
            // console.log(index + " invoiceDtailss " + JSON.stringify(invoiceDtailss))
            grandTotal = grandTotal + Number(invoiceDtailss.Sub_total_rm);

            let records = [
                { text: index + 1, alignment: 'center' },
                { text: invoiceDtailss.File_no },
                { text: invoiceDtailss.Invoice_no, alignment: 'center' },
                { text: dateFormat(invoiceDtailss.Invoice_date, "dd/mm/yyyy"), alignment: 'center' },
                { text: parseFloat(invoiceDtailss.Sub_total_rm).toFixed(2), alignment: 'center' },
                { text: parseFloat(invoiceDtailss.Advance_paid_amount).toFixed(2), alignment: 'center', style: 'tableHeader' },
                { text: parseFloat(parseFloat(invoiceDtailss.Sub_total_rm).toFixed(2) - parseFloat(invoiceDtailss.Advance_paid_amount).toFixed(2)).toFixed(2), alignment: 'center' },
            ];
            temp.push(records);
        }

        let totalAmount = [
            { text: 'Total (' + currencyCode + ')', bold: true, colSpan: 5 }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: grandTotal.toFixed(2), alignment: 'center', bold: true }
        ];
        temp.push(totalAmount);


        let PagetEndContand = {
            margin: [30, 10, 0, 0],
            columns: [
                {
                    headerRows: 1,
                    widths: [20],
                    text: [
                        { text: 'Dear Sir/Madam,\n\n', bold: false },
                        { text: 'OUTSTANDING PAYMENT\n\n', bold: true },
                        { text: 'We wish to draw your attention that below invoice(s) has been outstanding, appreciate very much if you could look into this matter and arrange for prompt payment upon receiving our letter.', bold: false, alignment: 'justified' },

                    ]
                },
            ]
        }

        let companyNameBold = { text: 'SIRIM QAS International Sdn. Bhd.', fontSize: 15, bold: true };

        let bankNameBold = { text: 'RHB Bank Berhad', fontSize: 15, bold: true };

        let accountNoBold = { text: '2-12451-4008608-7', fontSize: 15, bold: true };

        const paragraph1 = { margin: [30, 10, 30, 0], alignment: 'justified', text: "Enclosed herewith is a copy (ies) of the invoice (s) for your reference.To effect payment, you may issue a cheque in the name of " + companyNameBold + " or make payment direct to SIRIM QAS International Sdn. Bhd.'s account at " + bankNameBold + " Account number " + accountNoBold + " and thereafter send the bank-in slip to us as evidence of payment.", style: 'subheader' }

        // const paragraph1 = { margin: [30, 10, 30, 0], alignment: 'justified', text: "Enclosed herewith is a copy (ies) of the invoice (s) for your reference.To effect payment, you may issue a cheque in the name of SIRIM QAS International Sdn. Bhd. or make payment direct to SIRIM QAS International Sdn. Bhd.'s account at RHB Bank Berhad Account number 2-12451-4008608-7 and thereafter send the bank-in slip to us as evidence of payment.", style: 'subheader' }

        // const paragraph2 = {
        //     margin: [30, 10, 30, 0], text: "If you have any queries, you may contact En. Muhammad Fakrulrazi Bin Mohamed at 603-55445644, email: mrazi@sirim.my or Pn Azizun binti Ayub at 603-55445684, email: "
        //         + " azizun@sirim.my, fax: 603-55445672.  However, please ignore this reminder if you have made payment and accept our thanks."
        // }
        const paragraph3 = { alignment: 'left', text: "Yours sincerely,", }
        const paragraph4 = { alignment: 'left', text: "NORITA SULAIMAN", }
        const paragraph5 = { alignment: 'left', text: "Head", }
        const paragraph6 = { alignment: 'left', text: "Finance Section", }
        const paragraph7 = { alignment: 'left', text: "SIRIM QAS International Sdn Bhd", }
        // const paragraph7 = { alignment: 'left', text: constants.COMPANY_NAME, }

        const line = { type: 'line', x1: 0, y1: 10, x2: 600, y2: 10, lineWidth: 0.02, lineColor: '#000000' };

        var docDefinition = {
            content: [
                {
                    margin: [30, 10, 30, 0],
                    columns: [
                        {
                            headerRows: 1,
                            //widths: [20],
                            text: [
                                { text: 'Dear Sir/Madam,\n\n', bold: false },
                                { text: 'OUTSTANDING PAYMENT\n\n', bold: true },
                                { text: 'We wish to draw your attention that below invoice(s) has been outstanding, appreciate very much if you could look into this matter and arrange for prompt payment upon receiving our letter.', bold: false },

                            ]
                        },
                    ]
                },
                {
                    margin: [30, 10, 30, 0],
                    columns: [
                        {
                            style: 'tableExample',
                            table: {
                                // "widths": ["*"],
                                //widths:['*','*','*','*','*','*','*'],
                                headerRows: 1,
                                body: temp
                            },
                            layout: {
                                defaultBorder: true,
                            }
                        },
                    ]
                },
                {
                    text: [
                        'Enclosed herewith is a copy (ies) of the invoice (s) for your reference.To effect payment, you may issue a cheque in the name of',
                        { text: ' SIRIM QAS International Sdn. Bhd. ', bold: true },
                        " or make payment direct to SIRIM QAS International Sdn. Bhd.'s account at ",
                        { text: 'RHB Bank Berhad ', bold: true },
                        "Account number ",
                        { text: '2-12451-4008608-7 ', bold: true },
                        "and thereafter send the bank-in slip to us as evidence of payment.",
                    ],
                    margin: [30, 10, 30, 0]
                },
                // paragraph2
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
            pageMargins: [30, 250, 40, 150],
            header: function (currentPage, pageCount) {
                return [
                    {
                        margin: [30, 10, 30, 0],
                        columns: [
                            {
                                margin: [30, 30, 20, 0],
                                image: imageDir + '/Sirim_Invoice_Icon.jpg',
                                width: 60
                            },
                            {
                                margin: [40, 30, 30, 0],
                                text: [
                                    { text: (constants.LINE_HEADER_1), style: 'header', fontSize: 8, },
                                    '\n' + (constants.LINE_HEADER_2), '\n' + (constants.LINE_HEADER_3), '\n' + (constants.LINE_HEADER_4), '\n' + (constants.LINE_HEADER_5), '\n' + (constants.LINE_HEADER_6)
                                ],
                            }
                        ]
                    },
                    {
                        style: 'tableExample',
                        margin: [30, 0, 30, 0],
                        table: {
                            widths: [390, 'auto'],
                            headerRows: 1,
                            // dontBreakRows: true,
                            // keepWithHeaderRows: 1,
                            body: [
                                [{ margin: [30, 10, 0, 0], text: 'File No.: ' + invoiceDtails[0].File_no, bold: true, }, { text: 'FIRST REMINDER', bold: false, alignment: 'left' }],
                                [{ margin: [30, 5, 0, 0], text: moment().format("DD MMMM YYYY"), bold: false, }, { text: '', bold: false, }],
                                [{ margin: [30, 5, 0, 0], text: invoiceDtails[0].Company_name, bold: false, }, { text: '', bold: false, }],
                                [{ margin: [30, 0, 0, 0], text: invoiceDtails[0].Manufacturer_address1, bold: false, }, { text: '', bold: false, }],
                                [{ margin: [30, 0, 0, 0], text: invoiceDtails[0].Manufacturer_address2, bold: false, }, { text: '', bold: false, }],
                                [{ margin: [30, 0, 0, 0], text: invoiceDtails[0].Manufacturer_address3, bold: false, }, { text: '', bold: false, }],
                                [{ margin: [30, 0, 0, 0], text: stateDetails[0].StateName, bold: false, }, { text: '', bold: false, }],
                                [{ margin: [30, 0, 0, 0], text: countryDetails[0].CountryName + " " + addressDetails[0].PostCode, bold: false, }, { text: '', bold: false, }],
                                [{ margin: [30, 0, 0, 0], text: 'ATTN.: ' + FINANCE_DEPARTMENT, bold: false, }, { text: '', bold: false, }]
                            ]
                        }, layout: 'noBorders'

                    },

                ]
            },
            footer: function (currentPage, pageCount, pageSize) {
                return [
                    { text: paragraph3, margin: [60, 0, 0, 0], alignment: 'left' },
                    { text: paragraph4, margin: [60, 10, 0, 0], alignment: 'left' },
                    { text: paragraph5, margin: [60, 10, 0, 0], alignment: 'left' },
                    { text: paragraph6, margin: [60, 0, 0, 0], alignment: 'left' },
                    { text: paragraph7, margin: [60, 0, 0, 10], alignment: 'left' },
                    // { canvas: [Object.assign({}, line)] },
                    { margin: [0, 5, 0, 0], text: 'This is a computer generated document. No signature is required.', alignment: 'center' },
                    { margin: [0, 0, 0, 0], text: 'Page ' + currentPage + ' of ' + pageCount, alignment: 'center' },
                ]
            }
        };


    } catch (error) {
        console.log(JSON.stringify(error))
    }

    try {
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        // pdfDoc.pipe(blobStream());
        var fileName = dateFormat(new Date(), "dd_mmmm_yyyy_HH_mm_ss") + '.pdf';
        var filePath = __dirname + '\\PDF_File\\' + fileName;
        pdfDoc.pipe(fs.createWriteStream(filePath));
        pdfDoc.fileName = fileName;
        pdfDoc.filePath = filePath;
        pdfDoc.end();
    } catch (error) {
        console.log("File error : " + error)
    }

    return pdfDoc;
}



exports.pdfgenerateRemainderSecend = async (invoiceDtails) => {
    let grandTotal = 0;
    let currencyCode = invoiceDtails[0].Currency;
    let FINANCE_DEPARTMENT = 'FINANCE DEPARTMENT';

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
    var printer = new PdfPrinter(fonts);
    var temp = [];

    let itemListHeader = [
        { text: 'No.', style: 'tableHeader', bold: true, alignment: 'center' },
        { text: 'File Number', style: 'tableHeader', bold: true, alignment: 'center' },
        { text: 'Invoice No', style: 'tableHeader', bold: true, alignment: 'center' },
        { text: 'Date ', style: 'tableHeader', bold: true, alignment: 'center' },
        { text: 'Amount ' + currencyCode, style: 'tableHeader', bold: true, alignment: 'center' },
        { text: 'Amount Paid ' + currencyCode, style: 'tableHeader', bold: true, alignment: 'center' },
        { text: 'Balance Outstanding ' + currencyCode, style: 'tableHeader', bold: true, alignment: 'center' }

    ];

    temp.push(itemListHeader);

    let shipTos = [{ text: '', fontSize: 8, bold: true, colSpan: 8 }]
    // let cityDetails = await badDebtRepository.getCityDetailsById(invoiceDtails[0].City_id);
    let stateDetails = await badDebtRepository.getStateDetailsById(invoiceDtails[0].State_id);
    // console.log("stateDetails ==>" + JSON.stringify(stateDetails))
    let countryDetails = await badDebtRepository.getCountryDetailsById(invoiceDtails[0].Country_id);
    // console.log("countryDetails ==>" + JSON.stringify(countryDetails))
    let addressDetails = await badDebtRepository.getAddressDetailsById(invoiceDtails[0].Address_Id);
    // console.log("addressDetails ==>" + JSON.stringify(addressDetails))

    for (let index = 0; index < invoiceDtails.length; index++) {
        const invoiceDtailss = invoiceDtails[index];
        let columnWidth = 'width:auto';
        // console.log(index + " invoiceDtailss " + JSON.stringify(invoiceDtailss))
        grandTotal = grandTotal + Number(invoiceDtailss.Sub_total_rm);

        let records = [
            { text: index + 1, alignment: 'center' },
            { text: invoiceDtailss.File_no },
            { text: invoiceDtailss.Invoice_no, alignment: 'center' },
            { text: dateFormat(invoiceDtailss.Invoice_date, "dd/mm/yyyy"), alignment: 'center' },
            { text: parseFloat(invoiceDtailss.Sub_total_rm).toFixed(2), alignment: 'center' },
            { text: parseFloat(invoiceDtailss.Advance_paid_amount).toFixed(2), alignment: 'center', style: 'tableHeader' },
            { text: parseFloat(parseFloat(invoiceDtailss.Sub_total_rm).toFixed(2) - parseFloat(invoiceDtailss.Advance_paid_amount).toFixed(2)).toFixed(2), alignment: 'center' },
        ];
        temp.push(records);
    }

    let totalAmount = [
        { text: 'Total (' + currencyCode + ')', bold: true, colSpan: 5 }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: '' }, { text: grandTotal.toFixed(2), alignment: 'center', bold: true }
    ];
    temp.push(totalAmount);


    let PagetEndContand = {
        margin: [30, 10, 0, 0],
        columns: [
            {
                headerRows: 1,
                widths: [20],
                text: [
                    { text: 'Dear Sir/Madam,\n\n', bold: false },
                    { text: 'OUTSTANDING PAYMENT\n\n', bold: true },
                    { text: 'We wish to draw your attention that below invoice(s) has been outstanding, appreciate very much if you could look into this matter and arrange for prompt payment upon receiving our letter.', bold: false, alignment: 'justified' },

                ]
            },
        ]
    }

    let companyNameBold = { text: 'SIRIM QAS International Sdn. Bhd.', bold: true };

    let bankNameBold = { text: 'RHB Bank Berhad', bold: true };

    let accountNoBold = { text: '2-12451-4008608-7', bold: true };

    // const paragraph1 = { margin: [30, 10, 30, 0], alignment: 'justified', text: "Enclosed herewith is a copy (ies) of the invoice (s) for your reference.To effect payment, you may issue a cheque in the name of " + companyNameBold + " or make payment direct to SIRIM QAS International Sdn. Bhd.'s account at " + bankNameBold + " Account number " + accountNoBold + " and thereafter send the bank-in slip to us as evidence of payment.", style: 'subheader' }

    const paragraph1 = { margin: [30, 10, 30, 0], alignment: 'justified', text: "If payment is not received within 30 days from the date of this letter, we shall forward your overdue invoice(s) to our Legal Counsel for further action. To effect payment, you may issue a cheque in the name of SIRIM QAS International Sdn. Bhd. or make payment direct to SIRIM QAS International Sdn. Bhd.'s account at RHB Bank Berhad Account number 2-12451-4008608-7 and thereafter send the bank-in slip to us as evidence of payment." }

    // const paragraph2 = { margin: [30, 10, 30, 0], alignment: 'justified', text: "If you have any queries, you may contact En. Muhammad Fakrulrazi Bin Mohamed at 603-55445644, email: mrazi@sirim.my or Pn Azizun binti Ayub at 603-55445684, email: azizun@sirim.my, fax: 603-55445672. However, please ignore this reminder if you have made payment and accept our thanks." }

    const paragraph3 = { alignment: 'left', text: "Yours sincerely,", }
    const paragraph4 = { alignment: 'left', text: "NORITA SULAIMAN", }
    const paragraph5 = { alignment: 'left', text: "Head", }
    const paragraph6 = { alignment: 'left', text: "Finance Section", }
    const paragraph7 = { alignment: 'left', text: "SIRIM QAS International Sdn Bhd", }
    // const paragraph7 = { alignment: 'left', text: constants.COMPANY_NAME, }

    const line = { type: 'line', x1: 0, y1: 10, x2: 600, y2: 10, lineWidth: 0.02, lineColor: '#000000' };

    var docDefinition = {
        content: [
            {
                margin: [30, 10, 30, 0],
                columns: [
                    {
                        headerRows: 1,
                        //widths: [20],
                        text: [
                            { text: 'Dear Sir/Madam,\n\n', bold: false },
                            { text: 'OUTSTANDING PAYMENT\n\n', bold: true },
                            { text: 'We refer to our letter date ' + dateFormat(new Date(), "dd/mm/yyyy") + '\n\n', bold: false },
                            { text: 'We wish to draw your attention that below invoice(s) has been overdue, appreciate very much if you could look into this matter and arrange for prompt payment upon receiving our letter.', bold: false },
                        ]
                    },
                ]
            },
            {
                margin: [30, 10, 30, 0],
                columns: [
                    {
                        style: 'tableExample',
                        table: {
                            // "widths": ["*"],
                            //widths:['*','*','*','*','*','*','*'],
                            headerRows: 1,
                            body: temp
                        },
                        layout: {
                            defaultBorder: true,
                        }
                    },
                ]
            },
            {
                text: [
                    'Enclosed herewith is a copy (ies) of the invoice (s) for your reference.To effect payment, you may issue a cheque in the name of',
                    { text: ' SIRIM QAS International Sdn. Bhd. ', bold: true },
                    " or make payment direct to SIRIM QAS International Sdn. Bhd.'s account at ",
                    { text: 'RHB Bank Berhad ', bold: true },
                    "Account number ",
                    { text: '2-12451-4008608-7 ', bold: true },
                    "and thereafter send the bank-in slip to us as evidence of payment.",
                ],
                margin: [30, 10, 30, 0]
            },
            // paragraph2
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
        pageMargins: [30, 250, 40, 150],
        header: function (currentPage, pageCount) {
            return [
                {
                    margin: [30, 10, 30, 0],
                    columns: [
                        {
                            margin: [30, 30, 20, 0],
                            image: imageDir + '/Sirim_Invoice_Icon.jpg',
                            width: 60
                        },
                        {
                            margin: [40, 30, 30, 0],
                            text: [
                                { text: (constants.LINE_HEADER_1), style: 'header', fontSize: 8, },
                                '\n' + (constants.LINE_HEADER_2), '\n' + (constants.LINE_HEADER_3), '\n' + (constants.LINE_HEADER_4), '\n' + (constants.LINE_HEADER_5), '\n' + (constants.LINE_HEADER_6)
                            ],
                        }
                    ]
                },
                {
                    style: 'tableExample',
                    margin: [30, 0, 30, 0],
                    table: {
                        widths: [390, 'auto'],
                        headerRows: 1,
                        // dontBreakRows: true,
                        // keepWithHeaderRows: 1,
                        body: [
                            [{ margin: [30, 10, 0, 0], text: 'File No.: ' + invoiceDtails[0].File_no, bold: true, }, { text: 'SECOND REMINDER', bold: false, alignment: 'left' }],
                            [{ margin: [30, 5, 0, 0], text: moment().format("DD MMMM YYYY"), bold: false, }, { text: '', bold: false, }],
                            [{ margin: [30, 5, 0, 0], text: invoiceDtails[0].Company_name, bold: false, }, { text: '', bold: false, }],
                            [{ margin: [30, 0, 0, 0], text: invoiceDtails[0].Manufacturer_address1, bold: false, }, { text: '', bold: false, }],
                            [{ margin: [30, 0, 0, 0], text: invoiceDtails[0].Manufacturer_address2, bold: false, }, { text: '', bold: false, }],
                            [{ margin: [30, 0, 0, 0], text: invoiceDtails[0].Manufacturer_address3, bold: false, }, { text: '', bold: false, }],
                            [{ margin: [30, 0, 0, 0], text: stateDetails[0].StateName, bold: false, }, { text: '', bold: false, }],
                            [{ margin: [30, 0, 0, 0], text: countryDetails[0].CountryName + " " + addressDetails[0].PostCode, bold: false, }, { text: '', bold: false, }],
                            [{ margin: [30, 0, 0, 0], text: 'ATTN.: ' + FINANCE_DEPARTMENT, bold: false, }, { text: '', bold: false, }]
                        ]
                    }, layout: 'noBorders'

                },

            ]
        },
        footer: function (currentPage, pageCount, pageSize) {
            return [
                { text: paragraph3, margin: [60, 0, 0, 0], alignment: 'left' },
                { text: paragraph4, margin: [60, 10, 0, 0], alignment: 'left' },
                { text: paragraph5, margin: [60, 10, 0, 0], alignment: 'left' },
                { text: paragraph6, margin: [60, 0, 0, 0], alignment: 'left' },
                { text: paragraph7, margin: [60, 0, 0, 10], alignment: 'left' },
                // { canvas: [Object.assign({}, line)] },
                { margin: [0, 5, 0, 0], text: 'This is a computer generated document. No signature is required.', alignment: 'center' },
                { margin: [0, 0, 0, 0], text: 'Page ' + currentPage + ' of ' + pageCount, alignment: 'center' },
            ]
        }
    };
    try {
        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        // pdfDoc.pipe(blobStream());
        var fileName = dateFormat(new Date(), "dd_mmmm_yyyy_HH_mm_ss") + '.pdf';
        var filePath = __dirname + '\\PDF_File\\' + fileName;
        pdfDoc.pipe(fs.createWriteStream(filePath));
        pdfDoc.fileName = fileName;
        pdfDoc.filePath = filePath;
        pdfDoc.end();
    } catch (error) {
        console.log("File error : " + error)
    }

    return pdfDoc;
}