import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Task } from "@shared/schema";
import { format, isToday, isSameDay, addDays, subDays } from "date-fns";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { categoryIcons } from "@shared/schema";
import { TaskTimer } from "@/components/task-timer";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  // Format time display (copied from task-timer.tsx for consistency)
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  // Get tasks for selected date based on due date (or creation date if no due date)
  const tasksForSelectedDate = tasks.filter(task => {
    if (task.dueDate) {
      return isSameDay(new Date(task.dueDate), selectedDate);
    } 
    // Fallback to creation date if no due date is set
    const taskCreatedDate = task.createdAt ? new Date(task.createdAt) : null;
    return taskCreatedDate && isSameDay(taskCreatedDate, selectedDate);
  });

  // Group tasks by status
  const groupedTasks = tasksForSelectedDate.reduce((acc, task) => {
    const status = task.completed ? 'completed' : task.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  // Create a map of dates with tasks based on due date
  const taskDates = tasks.reduce((acc: Record<string, number>, task) => {
    if (task.dueDate) {
      const dateStr = format(new Date(task.dueDate), 'yyyy-MM-dd');
      acc[dateStr] = (acc[dateStr] || 0) + 1;
    } else if (task.createdAt) {
      // Fallback to creation date if no due date is set
      const dateStr = format(new Date(task.createdAt), 'yyyy-MM-dd');
      acc[dateStr] = (acc[dateStr] || 0) + 1;
    }
    return acc;
  }, {});

  // Navigation functions
  const goToPreviousDay = () => setSelectedDate(subDays(selectedDate, 1));
  const goToNextDay = () => setSelectedDate(addDays(selectedDate, 1));
  const goToToday = () => setSelectedDate(new Date());

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="order-2 md:order-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Task Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4 space-x-2">
              <Button variant="outline" size="sm" onClick={goToPreviousDay}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant={isToday(selectedDate) ? "default" : "outline"} 
                size="sm" 
                onClick={goToToday}
              >
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextDay}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              modifiers={{
                booked: (date) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  return dateStr in taskDates;
                }
              }}
              modifiersStyles={{
                booked: {
                  backgroundColor: 'hsl(var(--primary) / 0.1)',
                  color: 'hsl(var(--primary))',
                  fontWeight: '500'
                }
              }}
            />
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {Object.keys(taskDates).length > 0 && (
                <p>Days with tasks are highlighted</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="order-1 md:order-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                Tasks for {format(selectedDate, 'MMMM d, yyyy')}
                {isToday(selectedDate) && (
                  <Badge variant="outline" className="ml-2">Today</Badge>
                )}
              </span>
              <Badge variant="secondary">
                {tasksForSelectedDate.length} {tasksForSelectedDate.length === 1 ? 'task' : 'tasks'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {tasksForSelectedDate.length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(groupedTasks).map(([status, tasks]) => (
                    <div key={status} className="space-y-3">
                      <h3 className="font-medium capitalize text-sm text-muted-foreground">
                        {status} ({tasks.length})
                      </h3>
                      <div className="space-y-3">
                        {tasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex flex-col p-4 rounded-lg border space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              <h3 className="font-medium flex items-center gap-2">
                                {task.title}
                                {task.completed && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                                    Completed
                                  </Badge>
                                )}
                              </h3>
                              <Badge className={
                                task.priority === 'high' ? 'bg-red-500' :
                                task.priority === 'medium' ? 'bg-yellow-500' :
                                'bg-blue-500'
                              }>
                                {task.priority}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {task.category && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <span>{categoryIcons[task.category as keyof typeof categoryIcons]}</span>
                                  {task.category}
                                </Badge>
                              )}
                              {task.tags && task.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            {task.recurrence !== 'none' && (
                              <div className="text-sm text-muted-foreground">
                                Repeats: {task.recurrence}
                                {task.recurrenceInterval && ` (${task.recurrenceInterval})`}
                              </div>
                            )}

                            {task.reminderEnabled && task.reminderTime && (
                              <div className="text-sm text-muted-foreground">
                                Reminder: {format(new Date(task.reminderTime), 'PPp')}
                              </div>
                            )}

                            {task.timeSpent && task.timeSpent > 0 && (
                              <div className="text-sm text-muted-foreground">
                                Time spent: {formatTime(task.timeSpent)}
                              </div>
                            )}

                            {task.notes && (
                              <div className="text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                                {task.notes}
                              </div>
                            )}

                            {task.links && task.links.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {task.links.map((link, index) => (
                                  <a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer flex items-center gap-1 transition-colors"
                                  >
                                    {link.title}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    No tasks scheduled for this date
                  </p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}