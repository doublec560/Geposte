import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CalendarIcon, Filter, ChevronLeft, ChevronRight, Clock, Eye, Edit, Trash2, CheckCircle } from "lucide-react"
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns"
import { pt } from "date-fns/locale"

const mockPosts = [
  {
    id: 1,
    title: "Post sobre marketing digital",
    type: "image",
    network: "instagram",
    status: "scheduled",
    scheduledDate: new Date(2024, 11, 15, 14, 30),
    thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    title: "Carrossel de dicas",
    type: "carousel",
    network: "facebook",
    status: "approved",
    scheduledDate: new Date(2024, 11, 16, 10, 0),
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    title: "Reel motivacional",
    type: "reel",
    network: "instagram",
    status: "pending",
    scheduledDate: new Date(2024, 11, 18, 16, 45),
    thumbnail: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=100&h=100&fit=crop"
  },
  {
    id: 4,
    title: "Post corporativo",
    type: "image",
    network: "linkedin",
    status: "published",
    scheduledDate: new Date(2024, 11, 12, 9, 15),
    thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop"
  }
]

const postTypes = {
  image: { label: "Imagem", color: "bg-blue-500" },
  carousel: { label: "Carrossel", color: "bg-purple-500" },
  reel: { label: "Reel", color: "bg-orange-500" },
  video: { label: "Vídeo", color: "bg-green-500" }
}

const statusTypes = {
  scheduled: { label: "Agendado", variant: "default" as const },
  pending: { label: "Pendente", variant: "secondary" as const },
  approved: { label: "Aprovado", variant: "outline" as const },
  published: { label: "Publicado", variant: "destructive" as const }
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [filter, setFilter] = useState<string>("all")
  const [selectedPost, setSelectedPost] = useState<any>(null)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getPostsForDate = (date: Date) => {
    return mockPosts.filter(post => 
      isSameDay(post.scheduledDate, date) && 
      (filter === "all" || post.type === filter)
    )
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1))
      return newDate
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendário de Conteúdo</h1>
          <p className="text-muted-foreground mt-2">
            Visualize e gerencie suas publicações agendadas
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="image">Imagens</SelectItem>
              <SelectItem value="carousel">Carrosséis</SelectItem>
              <SelectItem value="reel">Reels</SelectItem>
              <SelectItem value="video">Vídeos</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={view} onValueChange={(value: "month" | "week" | "day") => setView(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mês</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="day">Dia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Calendar View */}
        <Card className="min-w-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {format(currentDate, "MMMM yyyy", { locale: pt })}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Hoje
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map(day => {
                const posts = getPostsForDate(day)
                const isToday = isSameDay(day, new Date())
                const isSelected = selectedDate && isSameDay(day, selectedDate)

                return (
                  <div
                    key={day.toISOString()}
                    className={`min-h-20 p-1.5 border rounded-lg cursor-pointer transition-colors ${
                      isToday ? "bg-accent border-accent-foreground" :
                      isSelected ? "bg-muted border-border" :
                      "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className={`text-sm font-medium mb-2 ${
                      isSameMonth(day, currentDate) ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {format(day, "d")}
                    </div>
                    
                    <div className="space-y-1">
                      {posts.slice(0, 2).map(post => (
                        <div
                          key={post.id}
                          className="text-xs p-1 rounded flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform"
                          style={{ backgroundColor: `${postTypes[post.type as keyof typeof postTypes]?.color}20` }}
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedPost(post)
                          }}
                        >
                          <div 
                            className={`w-2 h-2 rounded-full ${postTypes[post.type as keyof typeof postTypes]?.color}`}
                          />
                          <span className="truncate">{post.title}</span>
                        </div>
                      ))}
                      {posts.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{posts.length - 2} mais
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <Card className="w-full max-w-[300px]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Mini Calendário</CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-full scale-90 origin-top"
            />
            
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-sm">Legenda</h4>
              {Object.entries(postTypes).map(([type, config]) => (
                <div key={type} className="flex items-center gap-2 text-xs">
                  <div className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
                  <span>{config.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Post Details Modal */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Publicação</DialogTitle>
            <DialogDescription>
              Visualize e gerencie sua publicação agendada
            </DialogDescription>
          </DialogHeader>
          
          {selectedPost && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={selectedPost.thumbnail}
                  alt={selectedPost.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{selectedPost.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={statusTypes[selectedPost.status as keyof typeof statusTypes].variant}>
                      {statusTypes[selectedPost.status as keyof typeof statusTypes].label}
                    </Badge>
                    <Badge variant="outline">
                      {postTypes[selectedPost.type as keyof typeof postTypes].label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {format(selectedPost.scheduledDate, "PPP 'às' HH:mm", { locale: pt })}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Visualizar
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                {selectedPost.status === "pending" && (
                  <Button size="sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Aprovar
                  </Button>
                )}
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}