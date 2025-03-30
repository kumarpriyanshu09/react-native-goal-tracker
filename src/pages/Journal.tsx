
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Smile, Meh, Frown, Zap, Coffee, PenLine, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { JournalEntry } from "@/types";

const Journal = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "entry-1",
      date: new Date().toISOString(),
      title: "First day of journaling",
      content: "Today I started using a journal to keep track of my thoughts and experiences. I'm excited to see how this helps me reflect and grow.",
      mood: "happy",
    },
  ]);
  
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);
  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood: "neutral" as JournalEntry["mood"],
  });
  
  const [isCreating, setIsCreating] = useState(false);
  
  // Get the current date in a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  const handleCreateEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your journal entry.",
        variant: "destructive",
      });
      return;
    }
    
    const entry: JournalEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toISOString(),
      title: newEntry.title,
      content: newEntry.content,
      mood: newEntry.mood,
    };
    
    setEntries([entry, ...entries]);
    setNewEntry({
      title: "",
      content: "",
      mood: "neutral",
    });
    setIsCreating(false);
    
    toast({
      title: "Journal entry saved",
      description: "Your thoughts have been recorded successfully.",
    });
  };
  
  const getMoodIcon = (mood?: JournalEntry["mood"]) => {
    switch (mood) {
      case "happy":
        return <Smile className="text-green-500" />;
      case "sad":
        return <Frown className="text-red-500" />;
      case "productive":
        return <Zap className="text-yellow-500" />;
      case "tired":
        return <Coffee className="text-orange-500" />;
      case "neutral":
      default:
        return <Meh className="text-gray-500" />;
    }
  };
  
  const renderEntryList = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Journal</h1>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus size={18} />
          New Entry
        </Button>
      </div>
      
      {entries.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <PenLine className="mx-auto mb-2 h-10 w-10 opacity-50" />
          <p>No journal entries yet</p>
          <Button 
            onClick={() => setIsCreating(true)}
            variant="outline" 
            className="mt-4"
          >
            Write your first entry
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {entries.map((entry) => (
            <Card 
              key={entry.id} 
              className="hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => setActiveEntry(entry)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{entry.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(entry.date)}
                    </p>
                  </div>
                  {entry.mood && (
                    <div className="p-1">
                      {getMoodIcon(entry.mood)}
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm line-clamp-2">{entry.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
  
  const renderEntryDetail = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setActiveEntry(null)}
        >
          <ChevronLeft size={18} />
        </Button>
        <h2 className="text-xl font-medium">Journal Entry</h2>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold">{activeEntry?.title}</h1>
              <p className="text-sm text-muted-foreground">
                {formatDate(activeEntry?.date || "")}
              </p>
            </div>
            {activeEntry?.mood && (
              <div className="p-2 bg-background rounded-full shadow-sm">
                {getMoodIcon(activeEntry.mood)}
              </div>
            )}
          </div>
          
          <div className="mt-6 whitespace-pre-wrap">
            {activeEntry?.content}
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  const renderCreateForm = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCreating(false)}
        >
          <ChevronLeft size={18} />
        </Button>
        <h2 className="text-xl font-medium">New Journal Entry</h2>
      </div>
      
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Input
              placeholder="Entry title"
              value={newEntry.title}
              onChange={(e) => setNewEntry({...newEntry, title: e.target.value})}
              className="text-lg font-medium"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 py-2">
            <span className="text-sm text-muted-foreground mr-2">How are you feeling?</span>
            <Button
              variant={newEntry.mood === "happy" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewEntry({...newEntry, mood: "happy"})}
              className="flex items-center gap-1"
            >
              <Smile size={16} /> Happy
            </Button>
            <Button
              variant={newEntry.mood === "neutral" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewEntry({...newEntry, mood: "neutral"})}
              className="flex items-center gap-1"
            >
              <Meh size={16} /> Neutral
            </Button>
            <Button
              variant={newEntry.mood === "sad" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewEntry({...newEntry, mood: "sad"})}
              className="flex items-center gap-1"
            >
              <Frown size={16} /> Sad
            </Button>
            <Button
              variant={newEntry.mood === "productive" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewEntry({...newEntry, mood: "productive"})}
              className="flex items-center gap-1"
            >
              <Zap size={16} /> Productive
            </Button>
            <Button
              variant={newEntry.mood === "tired" ? "default" : "outline"}
              size="sm"
              onClick={() => setNewEntry({...newEntry, mood: "tired"})}
              className="flex items-center gap-1"
            >
              <Coffee size={16} /> Tired
            </Button>
          </div>
          
          <div>
            <Textarea
              placeholder="Write your journal entry here..."
              value={newEntry.content}
              onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
              className="min-h-[200px]"
            />
          </div>
          
          <div className="flex justify-end pt-2">
            <Button onClick={handleCreateEntry}>Save Entry</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  // Determine which view to render
  let content;
  if (isCreating) {
    content = renderCreateForm();
  } else if (activeEntry) {
    content = renderEntryDetail();
  } else {
    content = renderEntryList();
  }
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container px-4 py-8 pb-32">
        {content}
      </div>
    </div>
  );
};

export default Journal;
