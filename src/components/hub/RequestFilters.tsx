import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, SlidersHorizontal } from "lucide-react";

interface RequestFiltersProps {
  searchCity: string;
  setSearchCity: (city: string) => void;
  selectedService: string;
  setSelectedService: (service: string) => void;
  onSearch: () => void;
}

const services = [
  { value: 'all', label: 'Tous les services', icon: '🐕' },
  { value: 'promenade', label: 'Promenade', icon: '🚶' },
  { value: 'garde', label: 'Garde', icon: '🏠' },
  { value: 'visite', label: 'Visite à domicile', icon: '🛋️' },
  { value: 'veterinaire', label: 'Accompagnement véto', icon: '🏥' },
];

export const RequestFilters = ({
  searchCity,
  setSearchCity,
  selectedService,
  setSelectedService,
  onSearch,
}: RequestFiltersProps) => {
  return (
    <Card className="shadow-lg border-0 bg-card/98 backdrop-blur-md">
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
          {/* Service Type */}
          <div className="md:col-span-4">
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Type de service recherché
            </Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="h-11">
                <SelectValue>
                  <span className="flex items-center gap-2">
                    <span>{services.find(s => s.value === selectedService)?.icon}</span>
                    <span className="truncate">{services.find(s => s.value === selectedService)?.label}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.value} value={service.value}>
                    <span className="flex items-center gap-2">
                      <span>{service.icon}</span>
                      <span>{service.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Location */}
          <div className="md:col-span-5">
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Localisation
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ville ou code postal..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>
          
          {/* Search Button */}
          <div className="md:col-span-3">
            <Label className="text-xs font-medium text-transparent mb-1.5 block hidden md:block">.</Label>
            <Button onClick={onSearch} className="w-full h-11 gap-2 shadow-lg">
              <Search className="h-4 w-4" />
              Filtrer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
