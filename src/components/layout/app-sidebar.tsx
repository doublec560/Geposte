import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  PlusCircle,
  ImagePlus,
  Video,
  Sparkles,
  Calendar,
  Settings,
  Image,
  PenTool,
  ChevronDown
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  }
]

const createGroup = [
  {
    title: "Publicação",
    url: "/criar/publicacao",
    icon: ImagePlus,
  },
  {
    title: "Carrossel",
    url: "/criar/carrossel",
    icon: PlusCircle,
  },
  {
    title: "Reel",
    url: "/criar/reel",
    icon: Video,
  },
]

const aiGroup = [
  {
    title: "Gerar Copys",
    url: "/gerador/copys",
    icon: PenTool,
  },
  {
    title: "Gerar Imagens",
    url: "/gerador/imagens",
    icon: Image,
  },
]

const otherItems = [
  {
    title: "Calendário",
    url: "/calendario",
    icon: Calendar,
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
  },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const [createOpen, setCreateOpen] = useState(true)
  const [aiOpen, setAiOpen] = useState(true)

  const isActive = (path: string) => currentPath === path
  const isGroupActive = (items: Array<{ url: string }>) => 
    items.some(item => currentPath === item.url)

  const getNavClasses = (active: boolean) =>
    active 
      ? "bg-accent text-accent-foreground font-medium shadow-accent" 
      : "hover:bg-accent/10 hover:text-accent-foreground transition-smooth"

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className={collapsed ? "p-2" : "p-4"}>
        {/* Logo / Brand */}
        <div className={`flex items-center gap-2 py-4 border-b border-border ${collapsed ? 'px-1 justify-center' : 'px-2'}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg bg-gradient-accent bg-clip-text text-transparent">
              GEPOST
            </span>
          )}
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="mt-6">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink to={item.url} className={getNavClasses(isActive(item.url))}>
                    <item.icon className="h-5 w-5" />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Criar Group */}
        <SidebarGroup>
          <Collapsible open={collapsed ? false : createOpen} onOpenChange={setCreateOpen}>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className={`group/collapsible w-full flex items-center gap-2 text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground transition-smooth ${collapsed ? 'justify-center' : ''}`}>
                <PlusCircle className="h-4 w-4" />
                {!collapsed && (
                  <>
                    <span>Criar</span>
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </>
                )}
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            {!collapsed && (
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenuSub>
                    {createGroup.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <NavLink to={item.url} className={getNavClasses(isActive(item.url))}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarGroupContent>
              </CollapsibleContent>
            )}
          </Collapsible>
        </SidebarGroup>

        {/* Gerador IA Group */}
        <SidebarGroup>
          <Collapsible open={collapsed ? false : aiOpen} onOpenChange={setAiOpen}>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className={`group/collapsible w-full flex items-center gap-2 text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground transition-smooth ${collapsed ? 'justify-center' : ''}`}>
                <Sparkles className="h-4 w-4" />
                {!collapsed && (
                  <>
                    <span>Gerador IA</span>
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </>
                )}
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            {!collapsed && (
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenuSub>
                    {aiGroup.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild>
                          <NavLink to={item.url} className={getNavClasses(isActive(item.url))}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarGroupContent>
              </CollapsibleContent>
            )}
          </Collapsible>
        </SidebarGroup>

        {/* Other Items */}
        <SidebarGroup>
          <SidebarMenu>
            {otherItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink to={item.url} className={getNavClasses(isActive(item.url))}>
                    <item.icon className="h-5 w-5" />
                    {!collapsed && <span>{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
