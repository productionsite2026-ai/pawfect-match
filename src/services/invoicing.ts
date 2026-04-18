/**
 * Service Facturation - Génération automatique de factures PDF
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  bookingId: string;
  
  // Informations du promeneur (prestataire)
  walkerName: string;
  walkerEmail: string;
  walkerPhone: string;
  walkerAddress: string;
  
  // Informations du Propriétaire (client)
  ownerName: string;
  ownerEmail: string;
  ownerAddress: string;
  
  // Détails de la mission
  missionDescription: string;
  missionDate: Date;
  duration: number; // en heures
  
  // Montants
  hourlyRate: number;
  subtotal: number;
  taxRate: number; // en pourcentage
  tax: number;
  total: number;
  
  // Statut
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
}

/**
 * Générer une facture PDF
 */
export async function generateInvoicePDF(invoice: InvoiceData): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // En-tête
  doc.setFontSize(20);
  doc.text('FACTURE', margin, yPosition);
  
  yPosition += 10;
  doc.setFontSize(10);
  doc.text(`Numéro: ${invoice.invoiceNumber}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Date: ${invoice.date.toLocaleDateString('fr-FR')}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Statut: ${invoice.status.toUpperCase()}`, margin, yPosition);

  // Informations du promeneur (À gauche)
  yPosition += 10;
  doc.setFontSize(11);
  doc.text('Accompagnateur Certifié (Prestataire):', margin, yPosition);
  yPosition += 5;
  doc.setFontSize(9);
  doc.text(invoice.walkerName, margin, yPosition);
  yPosition += 4;
  doc.text(invoice.walkerEmail, margin, yPosition);
  yPosition += 4;
  doc.text(invoice.walkerPhone, margin, yPosition);
  yPosition += 4;
  doc.text(invoice.walkerAddress, margin, yPosition);

  // Informations du Propriétaire (À droite)
  const rightColumnX = pageWidth / 2 + margin;
  yPosition = margin + 10;
  doc.setFontSize(11);
  doc.text('Propriétaire (Client):', rightColumnX, yPosition);
  yPosition += 5;
  doc.setFontSize(9);
  doc.text(invoice.ownerName, rightColumnX, yPosition);
  yPosition += 4;
  doc.text(invoice.ownerEmail, rightColumnX, yPosition);
  yPosition += 4;
  doc.text(invoice.ownerAddress, rightColumnX, yPosition);

  // Détails de la mission
  yPosition = margin + 45;
  doc.setFontSize(11);
  doc.text('Détails de la mission:', margin, yPosition);
  yPosition += 5;
  doc.setFontSize(9);
  doc.text(`Description: ${invoice.missionDescription}`, margin, yPosition);
  yPosition += 4;
  doc.text(`Date: ${invoice.missionDate.toLocaleDateString('fr-FR')}`, margin, yPosition);
  yPosition += 4;
  doc.text(`Durée: ${invoice.duration} heure(s)`, margin, yPosition);

  // Tableau des montants
  yPosition += 10;
  const tableData = [
    ['Description', 'Quantité', 'Tarif unitaire', 'Montant'],
    [
      invoice.missionDescription,
      `${invoice.duration}h`,
      `${invoice.hourlyRate.toFixed(2)}€`,
      `${invoice.subtotal.toFixed(2)}€`,
    ],
    ['', '', 'Sous-total:', `${invoice.subtotal.toFixed(2)}€`],
    ['', '', `TVA (${invoice.taxRate}%):`, `${invoice.tax.toFixed(2)}€`],
    ['', '', 'TOTAL:', `${invoice.total.toFixed(2)}€`],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [tableData[0]],
    body: tableData.slice(1),
    margin: margin,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });

  // Notes
  if (invoice.notes) {
    yPosition = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(9);
    doc.text('Notes:', margin, yPosition);
    yPosition += 4;
    doc.setFontSize(8);
    doc.text(invoice.notes, margin, yPosition, { maxWidth: pageWidth - 2 * margin });
  }

  // Pied de page
  doc.setFontSize(8);
  doc.text(
    `Facture générée le ${new Date().toLocaleDateString('fr-FR')} - DogWalking`,
    margin,
    pageHeight - 10
  );

  return doc.output('blob');
}

/**
 * Télécharger une facture PDF
 */
export async function downloadInvoice(invoice: InvoiceData): Promise<void> {
  const blob = await generateInvoicePDF(invoice);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `facture-${invoice.invoiceNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Envoyer une facture par email
 */
export async function sendInvoiceByEmail(invoice: InvoiceData): Promise<boolean> {
  try {
    const blob = await generateInvoicePDF(invoice);
    
    // Créer FormData pour l'upload
    const formData = new FormData();
    formData.append('file', blob, `facture-${invoice.invoiceNumber}.pdf`);
    formData.append('email', invoice.ownerEmail);
    formData.append('invoiceNumber', invoice.invoiceNumber);

    // Appel à l'API pour envoyer l'email
    const response = await fetch('/api/invoices/send-email', {
      method: 'POST',
      body: formData,
    });

    return response.ok;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la facture:', error);
    return false;
  }
}

/**
 * Générer un numéro de facture unique
 */
export function generateInvoiceNumber(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(5, '0');
  
  return `FAC-${year}${month}${day}-${random}`;
}

/**
 * Calculer les montants de la facture
 */
export function calculateInvoiceAmounts(
  hourlyRate: number,
  duration: number,
  taxRate: number = 20
): { subtotal: number; tax: number; total: number } {
  const subtotal = hourlyRate * duration;
  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax;

  return { subtotal, tax, total };
}

export default {
  generateInvoicePDF,
  downloadInvoice,
  sendInvoiceByEmail,
  generateInvoiceNumber,
  calculateInvoiceAmounts,
};
