import { useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  url?: string;
}

export const useCalendarExport = () => {
  // Format date to iCal format (YYYYMMDDTHHmmssZ)
  const formatDateToICS = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  // Escape special characters for iCal
  const escapeICS = (text: string): string => {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");
  };

  // Generate unique UID
  const generateUID = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@dogwalking.fr`;
  };

  // Create ICS content for a single event
  const createICSEvent = (event: CalendarEvent): string => {
    const lines = [
      "BEGIN:VEVENT",
      `UID:${event.id || generateUID()}`,
      `DTSTAMP:${formatDateToICS(new Date())}`,
      `DTSTART:${formatDateToICS(event.startDate)}`,
      `DTEND:${formatDateToICS(event.endDate)}`,
      `SUMMARY:${escapeICS(event.title)}`,
    ];

    if (event.description) {
      lines.push(`DESCRIPTION:${escapeICS(event.description)}`);
    }

    if (event.location) {
      lines.push(`LOCATION:${escapeICS(event.location)}`);
    }

    if (event.url) {
      lines.push(`URL:${event.url}`);
    }

    // Add reminder 1 hour before
    lines.push("BEGIN:VALARM");
    lines.push("TRIGGER:-PT1H");
    lines.push("ACTION:DISPLAY");
    lines.push("DESCRIPTION:Rappel promenade DogWalking");
    lines.push("END:VALARM");

    // Add reminder 15 minutes before
    lines.push("BEGIN:VALARM");
    lines.push("TRIGGER:-PT15M");
    lines.push("ACTION:DISPLAY");
    lines.push("DESCRIPTION:Promenade dans 15 minutes");
    lines.push("END:VALARM");

    lines.push("END:VEVENT");

    return lines.join("\r\n");
  };

  // Create full ICS file content
  const createICSFile = (events: CalendarEvent[]): string => {
    const header = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//DogWalking//Réservations//FR",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:DogWalking - Mes promenades",
      "X-WR-TIMEZONE:Europe/Paris",
    ].join("\r\n");

    const eventsContent = events.map(createICSEvent).join("\r\n");

    const footer = "END:VCALENDAR";

    return `${header}\r\n${eventsContent}\r\n${footer}`;
  };

  // Download ICS file
  const downloadICS = useCallback((events: CalendarEvent[], filename?: string) => {
    const icsContent = createICSFile(events);
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "dogwalking-reservations.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Calendrier exporté",
      description: "Le fichier a été téléchargé. Importez-le dans votre calendrier."
    });
  }, []);

  // Export single booking
  const exportBooking = useCallback((booking: {
    id: string;
    scheduled_date: string;
    scheduled_time: string;
    duration_minutes: number;
    service_type: string;
    dog_name?: string;
    walker_name?: string;
    address?: string;
    city?: string;
  }) => {
    const startDate = new Date(`${booking.scheduled_date}T${booking.scheduled_time}`);
    const endDate = new Date(startDate.getTime() + booking.duration_minutes * 60000);

    const serviceLabels: Record<string, string> = {
      promenade: "Promenade",
      garde: "Garde",
      visite: "Visite",
      veterinaire: "Vétérinaire"
    };

    const event: CalendarEvent = {
      id: `booking-${booking.id}@dogwalking.fr`,
      title: `🐕 ${serviceLabels[booking.service_type] || "Service"} - ${booking.dog_name || "Mon chien"}`,
      description: `Réservation DogWalking\n\nService: ${serviceLabels[booking.service_type] || booking.service_type}\nChien: ${booking.dog_name || "Non spécifié"}\nAccompagnateur Certifié: ${booking.walker_name || "Non assigné"}\nDurée: ${booking.duration_minutes} minutes`,
      location: booking.address ? `${booking.address}, ${booking.city || ""}` : booking.city,
      startDate,
      endDate,
      url: `https://dogwalking.fr/bookings/${booking.id}`
    };

    downloadICS([event], `dogwalking-${booking.id.slice(0, 8)}.ics`);
  }, [downloadICS]);

  // Export multiple bookings
  const exportBookings = useCallback((bookings: Array<{
    id: string;
    scheduled_date: string;
    scheduled_time: string;
    duration_minutes: number;
    service_type: string;
    dog_name?: string;
    walker_name?: string;
    address?: string;
    city?: string;
  }>) => {
    const serviceLabels: Record<string, string> = {
      promenade: "Promenade",
      garde: "Garde",
      visite: "Visite",
      veterinaire: "Vétérinaire"
    };

    const events: CalendarEvent[] = bookings.map((booking) => {
      const startDate = new Date(`${booking.scheduled_date}T${booking.scheduled_time}`);
      const endDate = new Date(startDate.getTime() + booking.duration_minutes * 60000);

      return {
        id: `booking-${booking.id}@dogwalking.fr`,
        title: `🐕 ${serviceLabels[booking.service_type] || "Service"} - ${booking.dog_name || "Mon chien"}`,
        description: `Réservation DogWalking\n\nService: ${serviceLabels[booking.service_type] || booking.service_type}\nChien: ${booking.dog_name || "Non spécifié"}\nAccompagnateur Certifié: ${booking.walker_name || "Non assigné"}\nDurée: ${booking.duration_minutes} minutes`,
        location: booking.address ? `${booking.address}, ${booking.city || ""}` : booking.city,
        startDate,
        endDate,
        url: `https://dogwalking.fr/bookings/${booking.id}`
      };
    });

    downloadICS(events, "dogwalking-toutes-reservations.ics");
  }, [downloadICS]);

  // Generate Google Calendar URL
  const getGoogleCalendarUrl = useCallback((event: CalendarEvent): string => {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.title,
      dates: `${formatDateToICS(event.startDate)}/${formatDateToICS(event.endDate)}`,
      details: event.description || "",
      location: event.location || "",
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, []);

  // Open Google Calendar with event
  const openGoogleCalendar = useCallback((booking: {
    id: string;
    scheduled_date: string;
    scheduled_time: string;
    duration_minutes: number;
    service_type: string;
    dog_name?: string;
    walker_name?: string;
    address?: string;
    city?: string;
  }) => {
    const startDate = new Date(`${booking.scheduled_date}T${booking.scheduled_time}`);
    const endDate = new Date(startDate.getTime() + booking.duration_minutes * 60000);

    const serviceLabels: Record<string, string> = {
      promenade: "Promenade",
      garde: "Garde",
      visite: "Visite",
      veterinaire: "Vétérinaire"
    };

    const event: CalendarEvent = {
      id: booking.id,
      title: `🐕 ${serviceLabels[booking.service_type] || "Service"} - ${booking.dog_name || "Mon chien"}`,
      description: `Réservation DogWalking\n\nService: ${serviceLabels[booking.service_type] || booking.service_type}\nChien: ${booking.dog_name || "Non spécifié"}\nAccompagnateur Certifié: ${booking.walker_name || "Non assigné"}`,
      location: booking.address ? `${booking.address}, ${booking.city || ""}` : booking.city,
      startDate,
      endDate
    };

    const url = getGoogleCalendarUrl(event);
    window.open(url, "_blank");
  }, [getGoogleCalendarUrl]);

  return {
    exportBooking,
    exportBookings,
    openGoogleCalendar,
    downloadICS
  };
};