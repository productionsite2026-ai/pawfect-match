import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { 
  MapPin, Calendar as CalendarIcon, Dog, Clock, Search, 
  Filter, X, ChevronDown, Sparkles, RotateCcw
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

interface SearchFiltersProps {
  searchCity: string;
  setSearchCity: (city: string) => void;
  selectedService: string;
  setSelectedService: (service: string) => void;
  onSearch: () => void;
  activeFilters?: number;
}

const services = [
  { value: 'all', label: 'Tous les services', icon: '🐕' },
  { value: 'promenade', label: 'Promenade de chien', icon: '🚶' },
  { value: 'visite', label: 'Visite à domicile', icon: '🏠' },
  { value: 'garde', label: 'Garde de chien', icon: '🛏️' },
  { value: 'veterinaire', label: 'Accompagnement véto', icon: '🏥' },
];

const timeSlots = [
  { value: 'morning', label: '6h - 11h' },
  { value: 'midday', label: '11h - 15h' },
  { value: 'afternoon', label: '15h - 22h' },
];

const dogSizes = [
  { value: 'small', label: '0-7 kg' },
  { value: 'medium', label: '7-18 kg' },
  { value: 'large', label: '18-45 kg' },
  { value: 'giant', label: '45+ kg' },
];

export const SearchFilters = ({
  searchCity,
  setSearchCity,
  selectedService,
  setSelectedService,
  onSearch,
  activeFilters = 0
}: SearchFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [frequency, setFrequency] = useState<'once' | 'weekly'>('once');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [selectedDogSizes, setSelectedDogSizes] = useState<string[]>([]);
  const [starSittersOnly, setStarSittersOnly] = useState(false);
  const [firstAidCertified, setFirstAidCertified] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50]);
  
  const toggleTimeSlot = (slot: string) => {
    setSelectedTimeSlots(prev => 
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };
  
  const toggleDogSize = (size: string) => {
    setSelectedDogSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };
  
  const resetFilters = () => {
    setSearchCity('');
    setSelectedService('all');
    setFrequency('once');
    setDateRange({});
    setSelectedTimeSlots([]);
    setSelectedDogSizes([]);
    setStarSittersOnly(false);
    setFirstAidCertified(false);
    setPriceRange([0, 50]);
  };
  
  const filtersCount = [
    selectedTimeSlots.length > 0,
    selectedDogSizes.length > 0,
    starSittersOnly,
    firstAidCertified,
    priceRange[0] > 0 || priceRange[1] < 50
  ].filter(Boolean).length;

  return (
    <Card className="shadow-xl border-0 bg-card/98 backdrop-blur-md sticky top-20 z-30">
      <CardContent className="p-4 md:p-6">
        {/* Main Search Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
          {/* Service Type */}
          <div className="md:col-span-3">
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Type de service</Label>
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
          <div className="md:col-span-3">
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Adresse</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="94000 Créteil, France"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>
          
          {/* Frequency */}
          <div className="md:col-span-2">
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Fréquence</Label>
            <div className="flex h-11 rounded-lg border border-input overflow-hidden">
              <button
                type="button"
                onClick={() => setFrequency('once')}
                className={`flex-1 flex items-center justify-center gap-1.5 text-sm transition-colors ${
                  frequency === 'once' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                Une fois
              </button>
              <button
                type="button"
                onClick={() => setFrequency('weekly')}
                className={`flex-1 flex items-center justify-center gap-1.5 text-sm border-l transition-colors ${
                  frequency === 'weekly' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                }`}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Récurrent
              </button>
            </div>
          </div>
          
          {/* Date Picker */}
          <div className="md:col-span-2">
            <Label className="text-xs font-medium text-muted-foreground mb-1.5 block">Dates</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full h-11 justify-start font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <span className="truncate">
                        {format(dateRange.from, "dd/MM", { locale: fr })} - {format(dateRange.to, "dd/MM", { locale: fr })}
                      </span>
                    ) : (
                      format(dateRange.from, "dd MMM", { locale: fr })
                    )
                  ) : (
                    <span className="text-muted-foreground">Choisir</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange(range || {})}
                  locale={fr}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Search Button */}
          <div className="md:col-span-2">
            <Label className="text-xs font-medium text-transparent mb-1.5 block hidden md:block">.</Label>
            <Button onClick={onSearch} className="w-full h-11 gap-2 shadow-lg">
              <Search className="h-4 w-4" />
              Rechercher
            </Button>
          </div>
        </div>
        
        {/* Time Slots */}
        <div className="mt-4">
          <Label className="text-xs font-medium text-muted-foreground mb-2 block">Créneaux horaires</Label>
          <div className="flex flex-wrap gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.value}
                type="button"
                onClick={() => toggleTimeSlot(slot.value)}
                className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                  selectedTimeSlots.includes(slot.value)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-input hover:border-primary/50'
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Dog Size */}
        <div className="mt-4">
          <Label className="text-xs font-medium text-muted-foreground mb-2 block">Taille du chien (kg)</Label>
          <div className="flex flex-wrap gap-2">
            {dogSizes.map((size) => (
              <button
                key={size.value}
                type="button"
                onClick={() => toggleDogSize(size.value)}
                className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                  selectedDogSizes.includes(size.value)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-input hover:border-primary/50'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Toggle Filters */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch 
              id="star-sitters"
              checked={starSittersOnly}
              onCheckedChange={setStarSittersOnly}
            />
            <Label htmlFor="star-sitters" className="text-sm cursor-pointer flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-accent" />
              Star Sitters uniquement
            </Label>
          </div>
          <button 
            className="text-sm text-primary hover:underline"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            En savoir plus sur le programme
          </button>
        </div>
        
        {/* Advanced Filters Toggle */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtres ({filtersCount})</span>
            {filtersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-7 px-2 text-xs">
                Tout réinitialiser
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="first-aid"
                checked={firstAidCertified}
                onChange={(e) => setFirstAidCertified(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="first-aid" className="text-sm cursor-pointer">
                Secourisme canin/RCP
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
