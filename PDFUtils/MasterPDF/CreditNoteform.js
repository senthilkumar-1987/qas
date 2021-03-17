let invoiceDetails = require('../../repositories/PaymentRepository/Customers/ViewInvoices');
const pdfMakePrinter = require('pdfmake');
/* var pdfMake = require('./pdfmake'); */
const sirimUtils = require('../../repositories/ReportsMgtRepo/SirimUtils');
var fs = require('fs');

//var pdfFonts = require('./vfs_fonts');

var logger = require('../../logger');
var path = require('path');
var blobStream = require('blob-stream');
var moment = require('moment');
var dateFormat = require('dateformat');
const { json } = require('express');
// const { text } = require('pdfkit/js/mixins/text');
var fontDir = path.join(__dirname + '/fonts1');
// SIRIM_SERVER\CronScheduler\fonts1\verdana
var imageDir = path.join(__dirname + '/images');

//let filename = "creditNote";
let filename = dateFormat(new Date(), "dd_mmmm_yyyy_HH_mm_ss") + '.pdf'
// Stripping special characters
filename = encodeURIComponent(filename) + '.pdf'

let newDate = dateFormat(new Date(), 'dd/mm/yyyy ');

// var PdfPrinter = require('pdfmake');


// var fonts = {
//     Roboto: {
//         normal: 'fonts1/Roboto-Regular.ttf',
//         bold: 'fonts1/Roboto-Medium.ttf',
//         italics: 'fonts1/Roboto-Italic.ttf',
//         bolditalics: 'fonts1/Roboto-MediumItalic.ttf'
//     }
// };
// var PdfPrinter = require('pdfmake');
// var printer = new PdfPrinter(fonts);
// var fs = require('fs');


exports.generateCreditformPDF = async (req, res, InvoiceMAsterpdf, SC, OEname, HeadName) => {


	// console.log("generateCreditformPDF" + JSON.stringify(req.body));
	console.log("----mm---1");
	let sessionObj = req.userData;
	let inputData = req.body;

	let invoiceNo = inputData.invoiceNo;
	console.log("invoice no" + invoiceNo)
	console.log(JSON.stringify(invoiceNo))

	let resObj = {};
	try {
		// console.log(JSON.stringify(inputData))


		resObj = await this.pdfgenerate(InvoiceMAsterpdf[0], sessionObj, OEname, HeadName, SC);
		console.log("resObj.filenamessss\n" + resObj.filename)
		console.log(resObj.filepath)
		// res.writeHead(200, {
		//  "Content-Type": "application/pdf",
		//  'Content-disposition': 'attachment; filename=' + resObj.docName + '.pdf'
		// });
		// console.log(resObj)
	} catch (error) {
		console.log("ERROR == > " + error)
	}

	return resObj;
}


exports.pdfgenerate = async (InvoiceMAsterpdf, sessionObj, OEname, HeadName, SC) => {

	console.log("SC>>" + JSON.stringify(SC))

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
			normal: fontDir + '/verdana/verdana.ttf',
			bold: fontDir + '/verdana/Verdana Bold.ttf'

		},
		Roboto: {
			normal: fontDir + '/roboto/Roboto-Regular.ttf',
			bold: fontDir + '/roboto/Roboto-Medium.ttf',
			italics: fontDir + '/roboto/Roboto-Italic.ttf',
			bolditalics: fontDir + '/roboto/Roboto-MediumItalic.ttf'
		},
		Arial: {
			normal: fontDir + '/Arial/Arial.ttf',
			bold: fontDir + '/Arial/Arial Bold.ttf'

		},
	};

	var PdfPrinter = require('pdfmake');
	var printer = new PdfPrinter(fonts);
	var fs = require('fs');
	var temp = [];
	let record = [{ text: 'Refund Amount' }];
	temp.push(record);




	var docDefinition = {

		// pageMargins: [0, 700, 30, 90],
		// footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
		header: function (currentPage, pageCount, pageSize) {
			// you can apply any logic and return any valid pdfmake element

			return [
				{
					// margin: [15, 10, 25, 400],
					margin: [20, 10, -20, 0],
					style: 'tableExample',

					color: '#444',
					table: {
						// widths: [50, 170, 200, 100],
						widths: [60, 260, 170],
						// margin: [35, 10, -25, 0],
						headerRows: 2,
						// keepWithHeaderRows: 1,

						body: [
							[{
								rowSpan: 4,
								image: imageDir + '/Sirim_Invoice_Icon.jpg',
								width: 60,
								height: 80, alignment: 'center'
							}, { rowSpan: 4, text: '\n\nREQUEST FOR CREDIT NOTE', bold: true, fontSize: 13, alignment: 'center' }, { text: 'Form.No. :' }],
							[{ text: '' }, { text: '' }, { text: 'Issue No. : ' }],
							[{ text: '' }, { text: '' }, { text: 'Page 1 of 1' }],
							[{ text: '' }, { text: '' }, { text: 'Effective Date : ' }],
						]
					},
				},
			]
		},

		pageMargins: [20, 97, 0, 80],


		content: [

			{
				style: 'tableExample',
				// margin: [4, -20, 5, 20],

				table: {
					widths: [145, 120, 90, 70, 110],
					headerRows: 1,
					body: [
						[{ colSpan: 5, text: ' ' }, '', '', '', ''],
						[{ text: 'Section Code:' }, { text: InvoiceMAsterpdf.Sector_type_unitcode }, { colSpan: 2, text: '' }, '', ''],
						[{ text: 'Customer Name:' }, { text: InvoiceMAsterpdf.Company_name }, { colSpan: 2, text: 'Invoice No.:' }, ' ', { text: InvoiceMAsterpdf.Invoice_no }],
						[{ text: 'Customer ID:' }, { text: InvoiceMAsterpdf.Customer_id }, { colSpan: 2, text: 'Invoice Date:' }, '', moment(InvoiceMAsterpdf.Invoice_date).format('DD/MM/YYYY')],
						// [{ text: '' }, '', { text: '' }, ' ', ''],
						[{ text: 'Job/File Number:' }, { text: InvoiceMAsterpdf.File_no }, { colSpan: 2, text: 'Invoice Amount:' }, ' ', { text: InvoiceMAsterpdf.Sub_total_rm === '' ? '' : (InvoiceMAsterpdf.Sub_total_rm).toFixed(2) }],
						// [{ text: '' }, '', { text: '' }, ' ', ''],
						[{ text: 'Credit Note Amount  \n(Please tick one of the box):', fontSize: 11 }, {
							colSpan: 1, table: {
								heights: function (row) {
									return (row + 1) * 10;
								},
								widths: [20],
								body: [

									[''],

								]
							}
						}, { colSpan: 2, text: 'Full invoice amount', fontSize: 12 }, ' ', ''],
						["", {
							colSpan: 1, table: {
								heights: function (row) {
									return (row + 1) * 10;
								},
								widths: [20],
								body: [

									[''],

								]
							}
						}, { colSpan: 2, text: 'Partial (Reduction), RM', fontSize: 11 }, ' ', ''],
						// ["", '', { text: ' ' }, ' ', ''],
						[{ colSpan: 4, text: [{ text: 'Justification for Issuance of Credit Note ' }, { text: '(Please   tick one of the box): ', fontSize: 8 }] }, '', '', ' ', ''],
						// [{ text: '' }, '', { text: '' }, ' ', ''],
						[{
							table: {
								heights: function (row) {
									return (row + 1) * 10;
								},
								widths: [20],
								body: [

									[''],

								]
							}
						}, { text: 'Product returned ', fontSize: 11, margin: [-80, 0, 0, 0] }, {
							colSpan: 1, table: {
								heights: function (row) {
									return (row + 1) * 10;
								},
								widths: [20],
								body: [

									[''],

								]
							}
						}, { colSpan: 2, text: 'Contract terminated', fontSize: 11, margin: [-30, 0, 0, 0] }, ''],
						[{
							colSpan: 1, table: {
								heights: function (row) {
									return (row + 1) * 10;
								},
								widths: [20],
								body: [

									[''],

								]
							}
						}, { colSpan: 1, text: 'Wrong data entry ', fontSize: 11, margin: [-80, 0, 0, 0] }, {
							colSpan: 1, table: {
								heights: function (row) {
									return (row + 1) * 10;
								},
								widths: [20],
								body: [

									[''],

								]
							}
						}, { colSpan: 2, text: 'Wrong amount', fontSize: 11, margin: [-30, 0, 0, 0] }, ''],
						[{
							colSpan: 1, table: {
								heights: function (row) {
									return (row + 1) * 10;
								},
								widths: [20],
								body: [

									[''],

								]
							}
						}, { colSpan: 1, text: 'Others ', fontSize: 11, margin: [-80, 0, 0, 0] }, { colSpan: 3, text: '' }, '', ''],
						// ['', { colSpan: 1, text: ' ' }, { colSpan: 3, text: '' }, '', ''],
						// ['', { colSpan: 1, text: ' ' }, { colSpan: 2, text: '' }, '', ''],
						[{ colSpan: 1, text: [{ text: 'Refund Amount ' }, { text: '\n(Please tick one of the box):', fontSize: 8 }] }, {
							colSpan: 1, table: {
								heights: function (row) {
									return (row + 1) * 10;
								},
								widths: [20],
								body: [

									[''],

								]
							}
						}, {
							colSpan: 1, table: {
								heights: function (row) {
									return (row + 1) * 25;
								},
								widths: [120, 70],
								body: [

									['Full invoice amount ', {
										colSpan: 1, table: {
											heights: function (row) {
												return (row + 1) * 10;
											},
											widths: [20],
											body: [

												[''],

											]
										}
									}],

								]
							}, layout: 'noBorders'
						}, '', {
							colSpan: 1, table: {

								widths: [85, 10],
								height: [15, 15],
								body: [

									[{ text: 'Partial (Reduction),RM' }, " "],
									// ['', ""],

								]
							}, layout: 'noBorders'
						}],

						// [{ text: ' ' }, '', { text: '' }, '', ''],
						// [{ colSpan: 2, text: 'Prepared by,', alignment: 'center', bold: true, fontSize: 13 }, '', { colSpan: 3, text: 'Verified by,', alignment: 'center', bold: true, fontSize: 13 }, '', ''],

						// // [{ text: ' ' }, '', { colSpan: 2, text: '' }, '', ''],
						// // [{ text: ' ' }, '', { colSpan: 2, text: '' }, '', ''],
						// [{ text: 'Name: ' }, { text: InvoiceMAsterpdf.Prepared_by }, { text: 'Name: ' }, { colSpan: 2, text: OEname.length > 0 ? OEname[0].Created_by : '' }, ''],
						// [{ text: 'Date:  ' }, { text: moment(InvoiceMAsterpdf.Completion_date).format('DD/MM/YYYY') }, { text: 'Date:  ' }, { colSpan: 2, text: moment(InvoiceMAsterpdf.Created_date).format('DD/MM/YYYY') }, ''],

						// // [{ text: ' ' }, '', { colSpan: 2, text: '' }, '', ''],
						// [{ colSpan: 2, text: 'Recommended by,', alignment: 'center', bold: true, fontSize: 15 }, '', { colSpan: 3, text: 'Approved by,\n*Within current accounting period –\n HOD \n**Different accounting period – VP/Head \n of SBU/SUB,\n', alignment: 'center', bold: true, fontSize: 13 }, '', ''],

						// // [{ text: ' ' }, '', { colSpan: 2, text: '' }, '', ''],
						// // [{ text: ' ' }, '', { colSpan: 2, text: '' }, '', ''],
						// [{ text: 'Name: ' }, { text: HeadName.length > 0 ? HeadName[0].Created_by : '' }, { text: 'Name: ' }, { colSpan: 2, text: HeadName.length > 0 ? HeadName[0].Created_by : '' }, ''],
						// [{ text: 'Date:  ' }, { text: moment(InvoiceMAsterpdf.Created_date).format('DD/MM/YYYY') }, { text: 'Date:  ' }, { colSpan: 2, text: moment(InvoiceMAsterpdf.Approval_date).format('DD/MM/YYYY') }, ''],


						// [{ colSpan: 5, text: '*If approver has been delegated, please follow accordingly ', bold: true, fontSize: 13, }, '', '', ''],
						// [{ colSpan: 5, text: '** Please attach necessary documents; Invoice/DO/PO etc. to support this application\n ', bold: true, fontSize: 13, }, '', '', ''],
						// [{ colSpan: 5, text: 'Finance use only ', bold: true, alignment: 'center', fillColor: '#cccccc', }, '', '', '', ''],
						// [{ colSpan: 1, text: '  ' }, '', { colSpan: 3, text: 'Checked/Verified by,', alignment: 'center', bold: true, }, '', ''],
						// // [{ colSpan: 1, text: '  ' }, '', { colSpan: 3, text: ' ' }, '', ''],
						// [{ colSpan: 1, text: 'Received by:  ' }, '', { colSpan: 3, text: 'Name: ' }, '', ''],
						// [{ colSpan: 1, text: 'Received date:  ' }, '', { colSpan: 3, text: 'Date:  ' }, '', ''],
						// [{ colSpan: 1, text: ' ' }, '', { colSpan: 3, text: 'Comment (if any): ' }, '', ''],

					],

					// layout: 'noBorders'
				}, layout: 'noBorders', defaultStyle: {
					font: 'Arial',
					fontSize: 8
				},





				// layout: {
				//  hLineWidth: function (i, node) {
				//      return (i === 0 || i === node.table.body.length) ? 2 : 1;
				//  },
				//  vLineWidth: function (i, node) {
				//      return (i === 0 || i === node.table.widths.length) ? 2 : 1;
				//  },
				//  hLineColor: function (i, node) {
				//      return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
				//  },
				//  vLineColor: function (i, node) {
				//      return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
				//  },

				// }
			},
			{
				style: 'tableExample',
				//  pageMargins:[5, 40, 5, 20],

				table: {
					widths: [145, 120, 90, 70, 80],
					headerRows: 1,
					heights: [5, 25, 5],
					body: [
						[{ colSpan: 2, text: 'Prepared by,', alignment: 'center', bold: true, fontSize: 11 }, '', { colSpan: 3, text: 'Verified by,', alignment: 'center', bold: true, fontSize: 11 }, '', ''],
						[{ colSpan: 2, text: '', alignment: 'center', bold: true, fontSize: 13, border: [true, false, false, false] }, '',
						{ colSpan: 3, text: '', alignment: 'center', bold: true, fontSize: 13, border: [true, false, true, false] }, '', ''],
						[{ text: 'Name: ', border: [true, false, false, false] }, { text: SC.length > 0 ? SC[0].FullName : '', border: [false, false, false, false], fontSize: 10 },
						{ text: 'Name: ', border: [true, false, false, false] }, { colSpan: 2, text: OEname.length > 0 ? OEname[0].FullName : '', border: [false, false, true, false] }, ''],
						[{ text: 'Date:', border: [true, false, false, true] }, { text: SC.length > 0 ? moment(SC[0].Created_date).utc().format('DD/MM/YYYY') : '', border: [false, false, false, true] },
						{ text: 'Date:  ', border: [true, false, false, true] }, { colSpan: 2, text: OEname.length > 0 ? moment(OEname[0].Created_date).utc().format('DD/MM/YYYY') : '', border: [false, false, true, true] }, ''],

					],


				}, layout: {
					defaultBorder: true,
				}

			},

			'\n',
			{
				style: 'tableExample',
				//  pageMargins:[5, 40, 5, 20],

				table: {
					widths: [145, 120, 90, 70, 80],
					headerRows: 1,
					heights: [5, 25, 10],
					body: [

						// [{ text: ' ' }, '', { colSpan: 2, text: '' }, '', ''],
						[{ colSpan: 2, text: 'Recommended by,', alignment: 'center', bold: true, fontSize: 11 }, '',
						{ colSpan: 3, text: 'Approved by,\n*Within current accounting period –HOD \n**Different accounting period – VP/Head  of SBU/SUB,', alignment: 'center', bold: true, fontSize: 11 },
							'fff', ''],

						[{ text: ' ', border: [true, false, false, false] }, { text: '', border: [false, false, false, false] }, { text: ' ', border: [true, false, false, false] }, { colSpan: 2, text: '', border: [false, false, true, false] }, ''],
						[{ text: 'Name: ', border: [true, false, false, false] }, { text: HeadName.length > 0 ? HeadName[0].FullName : '', border: [false, false, false, false] },
						{ text: 'Name: ', border: [true, false, false, false] }, { colSpan: 2, text: sessionObj.contactPerson, border: [false, false, true, false] }, ''],

						[{ text: 'Date:  ', border: [true, false, false, true] }, { text: HeadName.length > 0 ? moment(HeadName[0].Created_date).utc().format('DD/MM/YYYY') : '', border: [false, false, false, true] },
						{ text: 'Date:  ', border: [true, false, false, true] }, { colSpan: 2, text: moment(new Date()).format('DD/MM/YYYY'), border: [false, false, true, true] }, ''],]

				}
			},
			{
				style: 'tableExample',
				//  pageMargins:[5, 40, 5, 20],

				table: {
					widths: [145, 120, 90, 70, 80],
					headerRows: 1,
					body: [
						[{ colSpan: 5, text: '*If approver has been delegated, please follow accordingly ', bold: true, fontSize: 11, }, '', '', ''],
						[{ colSpan: 5, text: '** Please attach necessary documents; Invoice/DO/PO etc. to support this application ', bold: true, fontSize: 11, }, '', '', ''],
						[{ colSpan: 5, text: 'Finance use only ', bold: true, alignment: 'center', fillColor: '#cccccc', }, '', '', '', ''],
						[{ colSpan: 1, text: '  ' }, '', { colSpan: 3, text: 'Checked/Verified by,', alignment: 'center', bold: true, }, '', ''],
						// [{ colSpan: 1, text: '  ' }, '', { colSpan: 3, text: ' ' }, '', ''],
						[{ colSpan: 1, text: 'Received by:  ' }, '', { colSpan: 3, text: 'Name: ' }, '', ''],
						[{ colSpan: 1, text: 'Received date:  ' }, '', { colSpan: 3, text: 'Date:  ' }, '', ''],
						[{ colSpan: 1, text: ' ' }, '', { colSpan: 3, text: 'Comment (if any): ' }, '', ''],

					]
				}, layout: {
					defaultBorder: false,
				}


			}

		]

	}

	let filenamess = dateFormat(new Date(), "dd_mmmm_yyyy_HH_mm_ss") + '.pdf'
	var pdfDoc = printer.createPdfKitDocument(docDefinition);
	var filepath = __dirname + '/' + filenamess
	// pdfDoc.pipe(fs.createWriteStream('/home/software1/Desktop/final.pdf'));

	// pdfDoc.pipe(fs.createWriteStream(__dirname + '/creditNote.pdf'));

	pdfDoc.pipe(fs.createWriteStream(filepath))
	pdfDoc.filename = filenamess
	pdfDoc.filepath = filepath;
	pdfDoc.pipe(blobStream());
	pdfDoc.end();


	// var pdfDoc = printer.createPdfKitDocument(docDefinition);
	// // pdfDoc.pipe(blobStream());

	// pdfDoc.pipe(fs.createWriteStream('document.pdf'));

	// pdfDoc.end();
	logger.info("eqeee ")
	return pdfDoc;


}