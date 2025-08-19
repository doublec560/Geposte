import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  Calendar, 
  Image, 
  Users, 
  PlusCircle, 
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles
} from "lucide-react"
import { Link } from "react-router-dom"

const stats = [
  {
    title: "Posts Agendados",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: Calendar,
    color: "text-blue-600"
  },
  {
    title: "Conteúdo Criado",
    value: "156",
    change: "+8%",
    trend: "up", 
    icon: Image,
    color: "text-green-600"
  },
  {
    title: "Alcance Total",
    value: "12.3K",
    change: "+23%",
    trend: "up",
    icon: Users,
    color: "text-accent"
  }
]

const recentPosts = [
  {
    id: 1,
    title: "Post promocional verão 2024",
    platform: "Instagram",
    status: "agendado",
    date: "15:30",
    type: "Imagem"
  },
  {
    id: 2,
    title: "Dicas de marketing digital",
    platform: "LinkedIn",
    status: "publicado",
    date: "14:00",
    type: "Carrossel"
  },
  {
    id: 3,
    title: "Behind the scenes",
    platform: "Instagram",
    status: "rascunho",
    date: "16:00",
    type: "Reel"
  }
]

const quickActions = [
  {
    title: "Nova Publicação",
    description: "Crie um post com imagem ou vídeo",
    href: "/criar/publicacao",
    icon: PlusCircle,
    color: "bg-accent hover:bg-accent/90"
  },
  {
    title: "Gerar Copy",
    description: "Use IA para criar textos únicos",
    href: "/gerador/copys",
    icon: Sparkles,
    color: "bg-blue-600 hover:bg-blue-700"
  },
  {
    title: "Gerar Imagem",
    description: "Crie imagens com inteligência artificial",
    href: "/gerador/imagens", 
    icon: Image,
    color: "bg-purple-600 hover:bg-purple-700"
  }
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-primary rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Bem-vindo ao Gepost</h1>
        <p className="text-white/80 text-lg">
          Gerencie as suas redes sociais de forma inteligente e eficiente
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link key={action.title} to={action.href}>
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                {stat.change} em relação ao mês anterior
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Posts Recentes
            </CardTitle>
            <CardDescription>
              Acompanhe seus últimos conteúdos criados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{post.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {post.platform}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {post.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                    {post.status === "agendado" && (
                      <Clock className="h-4 w-4 text-blue-500" />
                    )}
                    {post.status === "publicado" && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {post.status === "rascunho" && (
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/calendario">Ver Todos os Posts</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Tips & Help */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Dicas de Produtividade
            </CardTitle>
            <CardDescription>
              Aproveite ao máximo o Gepost
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <h4 className="font-medium text-sm mb-2">💡 Use o Gerador de IA</h4>
                <p className="text-sm text-muted-foreground">
                  Crie copys personalizadas para cada rede social em segundos
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-sm mb-2">📅 Agende com Antecedência</h4>
                <p className="text-sm text-muted-foreground">
                  Mantenha suas redes ativas programando posts para a semana
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
                <h4 className="font-medium text-sm mb-2">🎨 Crie Imagens Únicas</h4>
                <p className="text-sm text-muted-foreground">
                  Use nossa IA para gerar imagens personalizadas para seus posts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}