const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class CertificateGenerator {
  // Generate digital course completion certificate
  async generateCertificate(certificateData) {
    const { 
      userId, 
      courseId, 
      userName, 
      courseTitle, 
      completionDate 
    } = certificateData;

    // Generate unique certificate ID
    const certificateId = this.generateUniqueCertificateId();
    const certificateFileName = `certificate_${userId}_${courseId}.pdf`;
    const certificatePath = path.join(
      process.env.CERTIFICATE_STORAGE_PATH || './certificates', 
      certificateFileName
    );

    // Ensure certificates directory exists
    if (!fs.existsSync(path.dirname(certificatePath))) {
      fs.mkdirSync(path.dirname(certificatePath), { recursive: true });
    }

    // Create PDF certificate
    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4'
    });

    doc.pipe(fs.createWriteStream(certificatePath));

    // Certificate Design
    doc
      .font('Helvetica-Bold')
      .fontSize(40)
      .fillColor('#2c3e50')
      .text('Certificate of Completion', 100, 150, {
        align: 'center',
        width: 600
      });

    doc
      .font('Helvetica')
      .fontSize(20)
      .fillColor('#34495e')
      .text(`This is to certify that`, 100, 250, {
        align: 'center',
        width: 600
      });

    doc
      .font('Helvetica-Bold')
      .fontSize(30)
      .fillColor('#2980b9')
      .text(userName, 100, 300, {
        align: 'center',
        width: 600
      });

    doc
      .font('Helvetica')
      .fontSize(20)
      .fillColor('#34495e')
      .text(`has successfully completed the course`, 100, 350, {
        align: 'center',
        width: 600
      });

    doc
      .font('Helvetica-Bold')
      .fontSize(25)
      .fillColor('#2c3e50')
      .text(courseTitle, 100, 400, {
        align: 'center',
        width: 600
      });

    doc
      .font('Helvetica')
      .fontSize(16)
      .fillColor('#7f8c8d')
      .text(`Completion Date: ${completionDate.toLocaleDateString()}`, 100, 500, {
        align: 'center',
        width: 600
      })
      .text(`Certificate ID: ${certificateId}`, 100, 530, {
        align: 'center',
        width: 600
      });

    // Add decorative elements
    this.addCertificateBackground(doc);
    this.addWatermark(doc);

    doc.end();

    // Store certificate metadata in database
    const certificateMetadata = {
      userId,
      courseId,
      certificateId,
      certificateUrl: certificatePath,
      issuedAt: new Date()
    };

    await this.saveCertificateMetadata(certificateMetadata);

    return {
      url: certificatePath,
      id: certificateId
    };
  }

  // Add decorative background
  addCertificateBackground(doc) {
    doc
      .lineWidth(3)
      .strokeColor('#3498db')
      .roundedRect(50, 50, 700, 550, 20)
      .stroke();
  }

  // Add watermark
  addWatermark(doc) {
    doc
      .font('Helvetica')
      .fontSize(60)
      .fillColor('rgba(0, 0, 0, 0.1)')
      .rotate(45, { origin: [300, 400] })
      .text('VERIFIED', 150, 300, {
        origin: [300, 400]
      })
      .rotate(-45, { origin: [300, 400] });
  }

  // Generate unique certificate identifier
  generateUniqueCertificateId() {
    return `CERT-${uuidv4().slice(0, 8).toUpperCase()}`;
  }

  // Save certificate metadata to database
  async saveCertificateMetadata(metadata) {
    try {
      // Assuming a Certificate model exists
      const Certificate = require('../models/Certificate');
      await Certificate.create(metadata);
    } catch (error) {
      console.error('Certificate Metadata Save Error:', error);
    }
  }

  // Verify certificate authenticity
  async verifyCertificate(certificateId) {
    try {
      const Certificate = require('../models/Certificate');
      const certificate = await Certificate.findOne({ 
        where: { certificateId } 
      });

      return certificate ? {
        isValid: true,
        details: certificate
      } : {
        isValid: false
      };
    } catch (error) {
      console.error('Certificate Verification Error:', error);
      return { isValid: false };
    }
  }
}

module.exports = new CertificateGenerator();
