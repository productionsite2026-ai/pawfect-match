import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Search, Clock, TrendingUp, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { getSafeLocalStorage } from "@/lib/safeStorage";

interface SearchItem {
  id: string;
  type: "action" | "page" | "shortcut";
  label: string;
  description?: string;
  icon: LucideIcon;
  action: () => void;
  keywords?: string[];
}

interface DashboardSearchProps {
  items: SearchItem[];
  placeholder?: string;
}

const RECENT_SEARCHES_KEY = "dashboard_recent_searches";
const MAX_RECENT = 5;

const DashboardSearch = ({ items, placeholder = "Rechercher..." }: DashboardSearchProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = getSafeLocalStorage().getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        setRecentSearches([]);
      }
    }
  }, []);

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const saveRecentSearch = useCallback((term: string) => {
    if (!term.trim()) return;
    
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    getSafeLocalStorage().setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  }, [recentSearches]);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    getSafeLocalStorage().removeItem(RECENT_SEARCHES_KEY);
  }, []);

  const handleSelect = useCallback((item: SearchItem) => {
    saveRecentSearch(item.label);
    item.action();
    setOpen(false);
    setSearch("");
  }, [saveRecentSearch]);

  const handleRecentClick = useCallback((term: string) => {
    setSearch(term);
  }, []);

  const filteredItems = items.filter(item => {
    const searchLower = search.toLowerCase();
    return (
      item.label.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower) ||
      item.keywords?.some(k => k.toLowerCase().includes(searchLower))
    );
  });

  const groupedItems = {
    actions: filteredItems.filter(i => i.type === "action"),
    pages: filteredItems.filter(i => i.type === "page"),
    shortcuts: filteredItems.filter(i => i.type === "shortcut")
  };

  const showRecent = !search && recentSearches.length > 0;
  const showSuggestions = !search && !showRecent;

  // Quick suggestions when no search
  const quickSuggestions = items.slice(0, 4);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button 
        variant="outline" 
        onClick={() => setOpen(true)}
        className="w-full max-w-md justify-start gap-3 text-muted-foreground h-12 rounded-2xl border-2 border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
      >
        <Search className="h-4 w-4 group-hover:text-primary transition-colors" />
        <span className="flex-1 text-left">{placeholder}</span>
        <kbd className="ml-auto hidden md:inline-flex h-6 items-center gap-1 rounded-lg border bg-muted px-2 font-mono text-xs text-muted-foreground">
          ⌘K
        </kbd>
      </Button>
      
      <DialogContent className="p-0 max-w-2xl overflow-hidden border-2">
        <Command className="rounded-lg">
          <div className="flex items-center border-b px-4 bg-gradient-to-r from-muted/50 to-transparent">
            <Search className="h-5 w-5 text-primary shrink-0" />
            <CommandInput 
              placeholder="Que souhaitez-vous faire ?" 
              value={search}
              onValueChange={setSearch}
              className="border-0 focus:ring-0 text-lg h-14"
            />
            {search && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSearch("")}
                className="text-xs"
              >
                Effacer
              </Button>
            )}
          </div>
          
          <CommandList className="max-h-[400px]">
            <AnimatePresence mode="wait">
              {/* Empty State */}
              {search && filteredItems.length === 0 && (
                <CommandEmpty>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-12 text-center"
                  >
                    <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                    <p className="text-muted-foreground">Aucun résultat pour "{search}"</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      Essayez des termes comme "réservation", "chien" ou "message"
                    </p>
                  </motion.div>
                </CommandEmpty>
              )}
              
              {/* Recent Searches */}
              {showRecent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CommandGroup heading={
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        Recherches récentes
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-xs hover:text-destructive"
                        onClick={clearRecentSearches}
                      >
                        Effacer
                      </Button>
                    </div>
                  }>
                    {recentSearches.map((term, idx) => (
                      <CommandItem
                        key={`recent-${idx}`}
                        onSelect={() => handleRecentClick(term)}
                        className="flex items-center gap-3 p-3 cursor-pointer"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{term}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </motion.div>
              )}
              
              {/* Quick Suggestions */}
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CommandGroup heading={
                    <span className="flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Suggestions
                    </span>
                  }>
                    {quickSuggestions.map((item) => (
                      <CommandItem
                        key={`sug-${item.id}`}
                        onSelect={() => handleSelect(item)}
                        className="flex items-center gap-3 p-3 cursor-pointer group/item"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover/item:from-primary/20 group-hover/item:to-primary/10 transition-colors">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.label}</p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                        <Sparkles className="h-4 w-4 text-primary/50 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </motion.div>
              )}
              
              {/* Actions */}
              {groupedItems.actions.length > 0 && (
                <CommandGroup heading="Actions rapides">
                  {groupedItems.actions.map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => handleSelect(item)}
                      className="flex items-center gap-3 p-3 cursor-pointer group/item"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shadow-sm group-hover/item:shadow-md transition-all">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.label}</p>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              
              {/* Pages */}
              {groupedItems.pages.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Pages">
                    {groupedItems.pages.map((item) => (
                      <CommandItem
                        key={item.id}
                        onSelect={() => handleSelect(item)}
                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50"
                      >
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <span>{item.label}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}

              {/* Shortcuts */}
              {groupedItems.shortcuts.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Raccourcis clavier">
                    {groupedItems.shortcuts.map((item) => (
                      <CommandItem
                        key={item.id}
                        onSelect={() => handleSelect(item)}
                        className="flex items-center gap-3 p-3 cursor-pointer"
                      >
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <span>{item.label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </AnimatePresence>
          </CommandList>
          
          {/* Footer with tips */}
          <div className="border-t bg-muted/30 px-4 py-2.5 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px]">↑↓</kbd>
                naviguer
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px]">↵</kbd>
                sélectionner
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px]">esc</kbd>
                fermer
              </span>
            </div>
            <span className="text-muted-foreground/50">Powered by Open-Go</span>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardSearch;
