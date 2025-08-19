import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, RefreshCw, Download, Plus, Wand2, AlertCircle, Eye } from "lucide-react"
import { enhanceImagePrompt, generateImages } from "@/services/openaiService"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const styleOptions = [
  { value: "realistic", label: "Realista" },
  { value: "artistic", label: "Artístico" },
  { value: "cartoon", label: "Cartoon" },
  { value: "minimalist", label: "Minimalista" },
  { value: "professional", label: "Profissional" },
  { value: "vintage", label: "Vintage" },
]

const aspectRatios = [
  { value: "1:1", label: "Quadrado (1:1)" },
  { value: "16:9", label: "Paisagem (16:9)" },
  { value: "9:16", label: "Retrato (9:16)" },
  { value: "4:3", label: "Clássico (4:3)" },
  { value: "3:4", label: "Retrato clássico (3:4)" },
]

export default function GenerateImage() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("")
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [imageCount, setImageCount] = useState("1")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [selectedImageForView, setSelectedImageForView] = useState<string | null>(null)
  const { toast } = useToast()

  const handleEnhancePrompt = async () => {
    if (!prompt) return

    setIsEnhancing(true)
    setError(null)

    try {
      const enhanced = await enhanceImagePrompt(prompt)
      setEnhancedPrompt(enhanced)
      toast({
        title: "Prompt melhorado com sucesso!",
        description: "O prompt foi otimizado para gerar melhores imagens.",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      toast({
        title: "Erro ao melhorar prompt",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleGenerate = async () => {
    if (!prompt) return

    setIsGenerating(true)
    setError(null)

    try {
      const finalPrompt = enhancedPrompt || prompt
      const count = parseInt(imageCount)

      const images = await generateImages({
        prompt: finalPrompt,
        style,
        aspectRatio,
        count
      })

      const imageUrls = images.map(img => img.url)
      setGeneratedImages(imageUrls)

      toast({
        title: "Imagens geradas com sucesso!",
        description: `${count} imagem(ns) criada(s) com IA`,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      toast({
        title: "Erro ao gerar imagens",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = async (imageUrl: string, index: number) => {
    try {
      // Due to CORS restrictions on OpenAI blob storage, we'll open the image in a new tab
      // This allows users to right-click and save the image manually
      const link = document.createElement('a')
      link.href = imageUrl
      link.target = '_blank'
      link.rel = 'noopener noreferrer'

      // Try to set download attribute, though it may not work due to CORS
      link.download = `gepost-generated-image-${index + 1}.jpg`

      // Temporarily add to DOM and click
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Imagem aberta em nova aba",
        description: "Clique com o botão direito na imagem e selecione 'Salvar imagem como...' para baixar",
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Erro ao abrir imagem",
        description: "Não foi possível abrir a imagem em nova aba",
        variant: "destructive",
      })
    }
  }

  const createPost = (imageUrl: string) => {
    // Navigate to create post with this image
    console.log("Creating post with image:", imageUrl)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gerador de Imagens</h1>
        <p className="text-muted-foreground mt-2">
          Crie imagens únicas usando inteligência artificial
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Configuration */}
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle>Configuração</CardTitle>
            <CardDescription>
              Descreva a imagem que você quer gerar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="space-y-2">
              <Label htmlFor="prompt">Descrição da Imagem <span className="text-red-500">*</span></Label>
              <Textarea
                id="prompt"
                placeholder="Descreva a imagem que você quer gerar... Ex: Um gato laranja sentado em uma mesa de escritório com um laptop"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleEnhancePrompt}
                disabled={!prompt || isEnhancing}
                className="w-full"
              >
                {isEnhancing ? (
                  <>
                    <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                    Melhorando...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-3 w-3" />
                    Melhorar Prompt
                  </>
                )}
              </Button>
            </div>

            {enhancedPrompt && (
              <div className="p-3 bg-muted rounded-lg max-w-full">
                <Label className="text-xs text-muted-foreground">Prompt Melhorado:</Label>
                <p className="text-sm mt-1 break-words whitespace-pre-wrap">{enhancedPrompt}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(enhancedPrompt)}
                  className="mt-2 w-full"
                >
                  Usar Prompt Melhorado
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="style">Estilo <span className="text-red-500">*</span></Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estilo" />
                </SelectTrigger>
                <SelectContent>
                  {styleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="aspect">Formato <span className="text-red-500">*</span></Label>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aspectRatios.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageCount">Número de imagens a gerar <span className="text-red-500">*</span></Label>
              <Select value={imageCount} onValueChange={setImageCount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 imagem</SelectItem>
                  <SelectItem value="2">2 imagens</SelectItem>
                  <SelectItem value="3">3 imagens</SelectItem>
                  <SelectItem value="4">4 imagens</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!prompt || isGenerating || isEnhancing}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Gerando {imageCount} imagem{parseInt(imageCount) > 1 ? 's' : ''}...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar Imagens
                </>
              )}
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Dicas:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Seja específico na descrição</li>
                <li>Inclua detalhes sobre cores e estilo</li>
                <li>Mencione a composição desejada</li>
                <li>Use "ultra high resolution" para melhor qualidade</li>
              </ul>
            </div>
            {error && (
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg flex items-center space-x-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Erro na geração</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generated Images */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Imagens Geradas</CardTitle>
            <CardDescription>
              Selecione a imagem que mais te agrada
            </CardDescription>
          </CardHeader>
          <CardContent>
            {generatedImages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Sparkles className="mx-auto h-16 w-16 mb-4" />
                <h3 className="text-lg font-medium mb-2">Pronto para criar!</h3>
                <p>Configure os parâmetros e clique em "Gerar Imagens" para começar</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((imageUrl, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-square relative group">
                        <img
                          src={imageUrl}
                          alt={`Generated image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setSelectedImageForView(imageUrl)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Visualizar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => createPost(imageUrl)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Criar Post
                          </Button>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            Opção {index + 1}
                          </Badge>
                          <div className="flex gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => downloadImage(imageUrl, index)}
                                  >
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Baixar imagem</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    onClick={() => createPost(imageUrl)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Criar post com esta imagem</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {generatedImages.length > 0 && (
              <div className="mt-6 flex justify-center">
                <Button
                  variant="outline"
                  onClick={handleGenerate}
                  disabled={isGenerating || isEnhancing}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Gerar Novas Opções
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Visualização */}
      <Dialog open={!!selectedImageForView} onOpenChange={() => setSelectedImageForView(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Visualização da Imagem</DialogTitle>
            <DialogDescription>
              Visualize a imagem gerada em tamanho ampliado
            </DialogDescription>
          </DialogHeader>

          {selectedImageForView && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={selectedImageForView}
                  alt="Imagem ampliada"
                  className="max-w-full max-h-[60vh] object-contain rounded-lg"
                />
              </div>

              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    const index = generatedImages.indexOf(selectedImageForView)
                    downloadImage(selectedImageForView, index)
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Imagem
                </Button>
                <Button
                  onClick={() => {
                    createPost(selectedImageForView)
                    setSelectedImageForView(null)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Post
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}