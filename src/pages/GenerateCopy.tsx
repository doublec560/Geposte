import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, RefreshCw, Sparkles, Instagram, Facebook, Linkedin, Twitter, Youtube, AlertCircle } from "lucide-react"
import { generateCopy, regenerateVariation } from "@/services/openaiService"
import { useToast } from "@/hooks/use-toast"

const socialNetworks = [
  { id: "instagram", name: "Instagram", icon: Instagram },
  { id: "facebook", name: "Facebook", icon: Facebook },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin },
  { id: "twitter", name: "Twitter", icon: Twitter },
  { id: "youtube", name: "YouTube", icon: Youtube },
]

const toneOptions = [
  { value: "professional", label: "Profissional" },
  { value: "friendly", label: "Amigável" },
  { value: "funny", label: "Engraçado" },
  { value: "persuasive", label: "Persuasivo" },
  { value: "educational", label: "Educativo" },
  { value: "inspiring", label: "Inspirador" },
]

export default function GenerateCopy() {
  const [topic, setTopic] = useState("")
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([])
  const [tone, setTone] = useState("")
  const [variationCount, setVariationCount] = useState("3")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<Record<string, string[]>>({})
  const [regeneratingVariation, setRegeneratingVariation] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleNetworkChange = (networkId: string, checked: boolean) => {
    if (checked) {
      setSelectedNetworks(prev => [...prev, networkId])
    } else {
      setSelectedNetworks(prev => prev.filter(id => id !== networkId))
    }
  }

  const handleGenerate = async () => {
    if (!topic || selectedNetworks.length === 0 || !tone) return

    setIsGenerating(true)
    setError(null)

    try {
      const result = await generateCopy({
        topic,
        platforms: selectedNetworks,
        tone,
        variationCount: parseInt(variationCount)
      })

      setGeneratedContent(result)
      toast({
        title: "Conteúdo gerado com sucesso!",
        description: `${selectedNetworks.length} plataforma(s) processada(s)`,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      toast({
        title: "Erro ao gerar conteúdo",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copiado!",
        description: "Conteúdo copiado para a área de transferência",
      })
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o conteúdo",
        variant: "destructive",
      })
    }
  }

  const handleRegenerateVariation = async (platform: string, variationIndex: number) => {
    const variationKey = `${platform}-${variationIndex}`
    setRegeneratingVariation(variationKey)

    try {
      const currentVariation = generatedContent[platform][variationIndex]
      const newVariation = await regenerateVariation(topic, platform, tone, currentVariation)

      setGeneratedContent(prev => ({
        ...prev,
        [platform]: prev[platform].map((variation, index) =>
          index === variationIndex ? newVariation : variation
        )
      }))

      toast({
        title: "Variação regenerada!",
        description: "Nova versão do conteúdo foi criada",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      toast({
        title: "Erro ao regenerar",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setRegeneratingVariation(null)
    }
  }

  const getHashtags = (network: string) => {
    const commonHashtags = ["#marketing", "#conteudo", "#digital", "#estrategia", "#engajamento"]
    const networkHashtags: Record<string, string[]> = {
      instagram: ["#insta", "#instagram", "#reels", "#stories"],
      facebook: ["#facebook", "#fb", "#comunidade"],
      linkedin: ["#linkedin", "#profissional", "#networking", "#business"],
      twitter: ["#twitter", "#thread", "#viral"],
      youtube: ["#youtube", "#video", "#subscribe", "#creator"]
    }
    
    return [...commonHashtags, ...(networkHashtags[network] || [])].slice(0, 8)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gerador de Copys</h1>
        <p className="text-muted-foreground mt-2">
          Crie conteúdo otimizado para suas redes sociais usando IA
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Configuration */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Configuração</CardTitle>
            <CardDescription>
              Configure os parâmetros para gerar o conteúdo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="space-y-2">
              <Label htmlFor="topic">Tema do Conteúdo <span className="text-red-500">*</span></Label>
              <Textarea
                id="topic"
                placeholder="Descreva o tema principal do seu conteúdo..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Redes Sociais <span className="text-red-500">*</span></Label>
              <div className="space-y-2">
                {socialNetworks.map((network) => (
                  <div key={network.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={network.id}
                      checked={selectedNetworks.includes(network.id)}
                      onCheckedChange={(checked) => 
                        handleNetworkChange(network.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={network.id} className="flex items-center space-x-2">
                      <network.icon className={`h-4 w-4 social-${network.id}`} />
                      <span>{network.name}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tom de Voz <span className="text-red-500">*</span></Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tom" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="variationCount">Número de Variações</Label>
              <Select value={variationCount} onValueChange={setVariationCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 variação</SelectItem>
                  <SelectItem value="2">2 variações</SelectItem>
                  <SelectItem value="3">3 variações</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!topic || selectedNetworks.length === 0 || !tone || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar Conteúdo
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Conteúdo Gerado</CardTitle>
            <CardDescription>
              Suas copys personalizadas para cada rede social
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-4 border border-red-200 bg-red-50 rounded-lg flex items-center space-x-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Erro ao gerar conteúdo</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {Object.keys(generatedContent).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Sparkles className="mx-auto h-12 w-12 mb-4" />
                <p>Configure os parâmetros e clique em "Gerar Conteúdo" para começar</p>
              </div>
            ) : (
              <Tabs defaultValue={Object.keys(generatedContent)[0]} className="w-full">
                <TabsList className="grid w-full" style={{gridTemplateColumns: `repeat(${Object.keys(generatedContent).length}, 1fr)`}}>
                  {Object.keys(generatedContent).map((network) => {
                    const networkData = socialNetworks.find(n => n.id === network)
                    return (
                      <TabsTrigger key={network} value={network} className="flex items-center space-x-2">
                        {networkData && <networkData.icon className={`h-4 w-4 social-${network}`} />}
                        <span>{networkData?.name}</span>
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
                
                {Object.entries(generatedContent).map(([network, copies]) => (
                  <TabsContent key={network} value={network} className="space-y-4">
                    <div className="grid gap-4">
                      {copies.map((copy, index) => (
                        <Card key={index}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm">Variação {index + 1}</CardTitle>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(copy)}
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copiar
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="text-sm whitespace-pre-wrap">{copy}</div>
                            
                            <div className="space-y-2">
                              <Label className="text-xs">Hashtags Sugeridas:</Label>
                              <div className="flex flex-wrap gap-1">
                                {getHashtags(network).map((hashtag, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {hashtag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRegenerateVariation(network, index)}
                                disabled={regeneratingVariation === `${network}-${index}`}
                              >
                                {regeneratingVariation === `${network}-${index}` ? (
                                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                ) : (
                                  <RefreshCw className="h-3 w-3 mr-1" />
                                )}
                                {regeneratingVariation === `${network}-${index}` ? 'Gerando...' : 'Refazer'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}