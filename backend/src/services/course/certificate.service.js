const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class CertificateService {
  constructor() {
    this.certificateStoragePath = process.env.CERTIFICATE_STORAGE_PATH || './certificates';
    
    // Ensure certificate directory exists
    if (!fs.existsSync(this.certificateStoragePath)) {
      fs.mkdirSync(this.certificateStoragePath, { recursive: true });
    }
  }

  async generateCourseCertificate(course, userId) {
    const user = await this.getUserDetails(userId);
    const certificateId = uuidv4();
    const fileName = `${certificateId}_course_certificate.pdf`;
    const filePath = path.join(this.certificateStoragePath, fileName);

    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4'
    });

    // Create PDF stream
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Certificate Design
    doc.fontSize(25)
       .font('Helvetica-Bold')
       .text('Course Completion Certificate', { align: 'center' });

    doc.moveDown();
    doc.fontSize(16)
       .font('Helvetica')
       .text(`This is to certify that`, { align: 'center' });

    doc.moveDown();
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .text(user.name, { align: 'center', underline: true });

    doc.moveDown();
    doc.fontSize(14)
       .font('Helvetica')
       .text(`has successfully completed the course`, { align: 'center' });

    doc.moveDown();
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .text(course.title, { align: 'center', underline: true });

    // Add more details, dates, etc.
    doc.moveDown(2);
    doc.fontSize(10)
       .font('Helvetica')
       .text(`Certificate ID: ${certificateId}`, { align: 'center' });

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        resolve({
          certificateId,
          fileName,
          filePath,
          courseTitle: course.title
        });
      });

      stream.on('error', reject);
    });
  }

  async getUserDetails(userId) {
    const User = require('../models').User;
    return await User.findByPk(userId);
  }

  async validateCertificate(certificateId) {
    // Implement certificate validation logic
    const certificatePath = path.join(this.certificateStoragePath, `${certificateId}_course_certificate.pdf`);
    return fs.existsSync(certificatePath);
  }
}

module.exports = new CertificateService();
