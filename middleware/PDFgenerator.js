const PDFDocument = require('pdfkit-table')
// const ExcelJS = require('exceljs')
const fs = require('fs')

async function generateReport(reportType, data, type) {
    if(type === 'invoice'){
        //invoice 
  
    try {
        if (reportType === 'pdf') {


            const doc = new PDFDocument()

        // const headers = [['Product'], ['Price'], ['Quantity'], ['Subtotal']]
        const tData = data[0].products.map(product => {
        return [
          product.product_title,
          product.product_price,
          product.quantity,
          product.subtotal
        ]
         })

         let india = new Intl.NumberFormat("en-IN",{
            style: 'currency',
            currency: 'INR'
        })

         let grandtotal = india.format(data[0].total)
         const subtotal = ['', '', 'Subtotal : ', grandtotal]
         const tax = ['', '', 'Tax : ', data[0].itemsTotal]
         const shipping = ['', '', 'Shipping charge : ', '00']
        const total = ['', '', 'Total : ',grandtotal]
        // const date = ['', '','Invoice Date :', data[0].date]
   
        tData.push(subtotal, tax, shipping, total)
      
        const table = {   
        title: 'TIMES HUB WATCHES pvt.limited',
        subtitle: 'Invoice Date :'+data[0].date,
        headers: ['Product', 'Price', 'Quantity', 'Subtotal'],
        rows: tData

        

      }
      await doc.table(table)


            // doc.text(JSON.stringify(data))
            const filename = 'sales-report.pdf'
            const writeStream = fs.createWriteStream(filename)
            doc.pipe(writeStream)
            doc.end()
            await new Promise((resolve, reject) => {
                writeStream.on('finish', () => {
                    
                    resolve(filename)
                })
                writeStream.on('error', (error) => {
                    console.error(`Error saving PDF report: ${error}`)
                    reject(error)
                })
            })
            return filename
        }else {
            throw new Error(`Invalid report type: ${reportType}`)
        }
    } catch (error) {
        console.error(`Error generating ${reportType} report: ${error}`)
        throw error
    }
    }else{
        //admin side report
     
    try {
        if (reportType === 'pdf') {


            const doc = new PDFDocument()

        // const headers = [['Product'], ['Price'], ['Quantity'], ['Subtotal']]
        // const tData = data[0].products.map(product => {
        // return [
        //   product.product_title,
        //   product.product_price,
        //   product.quantity,
        //   product.subtotal
        // ]
        //  })
        let tData = []

         let india = new Intl.NumberFormat("en-IN",{
            style: 'currency',
            currency: 'INR'
        })
        let date = new Date().toDateString()
        const totalRevenue = ['Total Revenue', '', '',data[0].totalValue]
        const orderCount = [ 'Total Orders', '', '',data[0].orderCount]
        const noofproduct = ['Total No:of Products', '', '', data[0].productCount]
       const monthlyEarnings = ['Monthly Earnings', '', '',data[0].totalValue]
        // const date = ['', '','Invoice Date :', data[0].date]
       
        tData.push(totalRevenue, orderCount, noofproduct,monthlyEarnings )
       
        const table = {   
        title: 'TIMES HUB WATCHES pvt.limited ',
        subtitle: date,
        headers: ['Sales Report', '', '', ''],
        rows: tData

        

      }
      await doc.table(table)


            // doc.text(JSON.stringify(data))
            const filename = 'sales-report.pdf'
            const writeStream = fs.createWriteStream(filename)
            doc.pipe(writeStream)
            doc.end()
            await new Promise((resolve, reject) => {
                writeStream.on('finish', () => {
                  
                    resolve(filename)
                })
                writeStream.on('error', (error) => {
                    console.error(`Error saving PDF report: ${error}`)
                    reject(error)
                })
            })
            return filename
        }else {
            throw new Error(`Invalid report type: ${reportType}`)
        }
    } catch (error) {
        console.error(`Error generating ${reportType} report: ${error}`)
        throw error
    }


    }
}
module.exports = generateReport