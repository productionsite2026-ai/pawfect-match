import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickSearchBarProps {
  placeholder?: string;
}

const QuickSearchBar = ({ placeholder = "Trouver un Accompagnateur..." }: QuickSearchBarProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/walkers');
  };

  return (
    <div 
      className="relative mb-6 cursor-pointer"
      onClick={handleClick}
    >
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        readOnly
        placeholder={placeholder}
        className="pl-12 h-14 rounded-2xl bg-muted/50 border-border/60 text-base cursor-pointer hover:bg-muted/70 transition-colors"
      />
    </div>
  );
};

export default QuickSearchBar;
