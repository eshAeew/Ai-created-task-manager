import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle, Circle, AlertTriangle } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export type TaskFilterOptions = {
  showCompleted: boolean;
  showNotCompleted: boolean;
  showOverdue: boolean;
};

interface TaskFilterProps {
  filters: TaskFilterOptions;
  onFilterChange: (filters: TaskFilterOptions) => void;
}

export function TaskFilter({ filters, onFilterChange }: TaskFilterProps) {
  const [open, setOpen] = useState(false);

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // Get a summary of active filters for the badge
  const getFilterSummary = (): string => {
    const parts = [];
    if (filters.showCompleted) parts.push("Completed");
    if (filters.showNotCompleted) parts.push("Not Completed");
    if (filters.showOverdue) parts.push("Overdue");
    
    return parts.join(", ");
  };

  const handleFilterChange = (key: keyof TaskFilterOptions, value: boolean) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      showCompleted: true,
      showNotCompleted: true,
      showOverdue: false,
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 border-dashed flex items-center gap-1"
        >
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-1 px-1 font-normal rounded-sm"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="p-2">
          <div className="text-sm font-medium py-1.5">Filter by Status</div>
          <div className="grid gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="completed" 
                checked={filters.showCompleted}
                onCheckedChange={(checked) => 
                  handleFilterChange("showCompleted", checked === true)
                }
              />
              <Label htmlFor="completed" className="flex items-center gap-1 text-sm font-normal">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Completed
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="not-completed" 
                checked={filters.showNotCompleted}
                onCheckedChange={(checked) => 
                  handleFilterChange("showNotCompleted", checked === true)
                }
              />
              <Label htmlFor="not-completed" className="flex items-center gap-1 text-sm font-normal">
                <Circle className="h-4 w-4 text-gray-500" />
                Not Completed
              </Label>
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <div className="text-sm font-medium py-1.5">Filter by Due Date</div>
          <div className="grid gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="overdue" 
                checked={filters.showOverdue}
                onCheckedChange={(checked) => 
                  handleFilterChange("showOverdue", checked === true)
                }
              />
              <Label htmlFor="overdue" className="flex items-center gap-1 text-sm font-normal">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Overdue
              </Label>
            </div>
          </div>

          <Separator className="my-2" />

          {activeFilterCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-start text-sm" 
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}