import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Upload, CalendarIcon, Sparkles, Play } from "lucide-react"
import { format } from "date-fns"
import { pt } from "date-fns/locale"

export default function CreateReel() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [scheduleDate, setScheduleDate] = useState<Date>()
  const [requiresApproval, setRequiresApproval] = useState(false)
  const [isScheduled, setIsScheduled] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Criar Reel</h1>
        <p className="text-muted-foreground mt-2">
          Crie um novo Reel para suas redes sociais
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Vídeo do Reel</CardTitle>
            <CardDescription>
              Faça upload de um vídeo vertical para seu Reel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input
                id="file-upload"
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="relative mx-auto w-32 h-56 bg-muted rounded-lg overflow-hidden">
                    <video 
                      src={URL.createObjectURL(selectedFile)}
                      className="w-full h-full object-cover"
                      controls={false}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Arraste e solte ou clique para selecionar vídeo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Suporta vídeos até 100MB (recomendado: 9:16)
                  </p>
                </div>
              )}
            </div>

            {selectedFile && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="text-sm font-medium mb-2">Dicas para Reels:</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Use formato vertical (9:16) para melhor visualização</li>
                  <li>• Mantenha entre 15-90 segundos de duração</li>
                  <li>• Adicione texto e elementos visuais chamativos</li>
                  <li>• Use hashtags relevantes na descrição</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content */}
        <Card>
          <CardHeader>
            <CardTitle>Conteúdo</CardTitle>
            <CardDescription>
              Adicione a descrição e configure o agendamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Descrição</Label>
                <Button variant="outline" size="sm" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Gerar com IA
                </Button>
              </div>
              <Textarea
                id="description"
                placeholder="Escreva a descrição do seu Reel... Use hashtags para aumentar o alcance!"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="schedule"
                checked={isScheduled}
                onCheckedChange={setIsScheduled}
              />
              <Label htmlFor="schedule">Agendar publicação</Label>
            </div>

            {isScheduled && (
              <div className="space-y-2">
                <Label>Data e hora</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {scheduleDate ? (
                        format(scheduleDate, "PPP", { locale: pt })
                      ) : (
                        <span>Selecione a data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={scheduleDate}
                      onSelect={setScheduleDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="approval"
                checked={requiresApproval}
                onCheckedChange={setRequiresApproval}
              />
              <Label htmlFor="approval">Requer aprovação</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button className="flex-1" disabled={!selectedFile}>
          {isScheduled ? "Agendar Reel" : "Publicar Agora"}
        </Button>
        <Button variant="outline">Salvar Rascunho</Button>
      </div>
    </div>
  )
}