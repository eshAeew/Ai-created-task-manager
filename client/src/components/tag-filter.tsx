import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ChevronDown, Tag, Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TagFilterProps {
  selectedTags: string[];
  availableTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagFilter({ selectedTags, availableTags, onTagsChange }: TagFilterProps) {
  const [showAllTags, setShowAllTags] = useState(false);
  
  // Initial number of tags to show in compact mode
  const INITIAL_TAG_COUNT = 10;

  const handleRemoveTag = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag));
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      handleRemoveTag(tag);
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  // Create a list of unique tags
  const uniqueTags = Array.from(new Set([...availableTags])).sort();
  
  // Get tags to display based on show all toggle
  const visibleTags = showAllTags ? uniqueTags : uniqueTags.slice(0, INITIAL_TAG_COUNT);
  const hasMoreTags = uniqueTags.length > INITIAL_TAG_COUNT;

  return (
    <div className="flex-1">
      <div className="flex items-center gap-2">
        {/* Selected Tags - show up to 3 selected tags directly in the interface */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {selectedTags.slice(0, 3).map(tag => (
            <Badge 
              key={tag} 
              variant="default"
              className="flex items-center gap-0.5 h-6 text-xs bg-primary/10 text-primary hover:bg-primary/20 border-0"
            >
              #{tag}
              <button
                className="ml-1 hover:bg-transparent rounded-full focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTag(tag);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          
          {/* Show count badge if there are more than 3 selected tags */}
          {selectedTags.length > 3 && (
            <Badge variant="outline" className="h-6 text-xs">
              +{selectedTags.length - 3} more
            </Badge>
          )}
          
          {/* Clear tags button only if any tags are selected */}
          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs px-1.5 text-muted-foreground"
              onClick={() => onTagsChange([])}
            >
              Clear
            </Button>
          )}
        </div>
        
        {/* Tag filter popover containing all available tags */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={`h-7 px-2 flex gap-1 items-center text-xs ${selectedTags.length > 0 ? 'border-primary/50 text-primary' : ''}`}
            >
              <Filter className="h-3.5 w-3.5" />
              <span>{selectedTags.length > 0 ? `${selectedTags.length} tag${selectedTags.length !== 1 ? 's' : ''} selected` : 'Filter by tags'}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[325px] p-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b">
                <h4 className="text-sm font-medium">Available Tags</h4>
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs px-1.5"
                    onClick={() => onTagsChange([])}
                  >
                    Clear All
                  </Button>
                )}
              </div>
              
              {uniqueTags.length > 0 ? (
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  <div className="flex flex-wrap gap-1.5">
                    {visibleTags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className={`cursor-pointer text-xs py-1 ${
                          selectedTags.includes(tag) 
                            ? "bg-primary/10 text-primary hover:bg-primary/20 border-0" 
                            : "bg-card text-muted-foreground hover:bg-accent border border-input"
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        #{tag}
                        {selectedTags.includes(tag) && (
                          <X className="ml-1 h-3 w-3" />
                        )}
                      </Badge>
                    ))}
                  </div>
                  
                  {hasMoreTags && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full h-6 text-xs justify-center items-center p-0 text-muted-foreground"
                      onClick={() => setShowAllTags(!showAllTags)}
                    >
                      {showAllTags ? "Show Less" : `Show All (${uniqueTags.length - INITIAL_TAG_COUNT} more)`}
                      <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${showAllTags ? 'rotate-180' : ''}`} />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center py-4 text-muted-foreground text-sm">
                  <Tag className="mr-2 h-4 w-4" />
                  No tags available yet
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}