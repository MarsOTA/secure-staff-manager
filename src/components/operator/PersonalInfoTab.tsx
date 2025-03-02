
import React from "react";
import { ExtendedOperator, SERVICES, AVAILABILITY, LANGUAGES, SIZES, HAIR_COLORS, BODY_TYPES } from "@/types/operator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Instagram, Facebook, Linkedin } from "lucide-react";

interface PersonalInfoTabProps {
  operator: ExtendedOperator;
  imagePreviewUrls: Record<string, string>;
  onFieldChange: (field: keyof ExtendedOperator, value: any) => void;
  onServiceToggle: (service: string) => void;
  onAvailabilityToggle: (availability: string) => void;
  onLanguageToggle: (language: string, type: 'fluent' | 'basic') => void;
  onSizeToggle: (size: string) => void;
  onFileUpload: (field: keyof ExtendedOperator, fileNameField: keyof ExtendedOperator, file: File | null) => void;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  operator,
  imagePreviewUrls,
  onFieldChange,
  onServiceToggle,
  onAvailabilityToggle,
  onLanguageToggle,
  onSizeToggle,
  onFileUpload
}) => {
  return (
    <div className="space-y-6">
      {/* DATI ANAGRAFICI */}
      <Card>
        <CardHeader>
          <CardTitle>Dati Anagrafici</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Data di nascita</Label>
              <Input
                id="birthDate"
                type="date"
                value={operator.birthDate}
                onChange={(e) => onFieldChange("birthDate", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthCountry">Paese di nascita</Label>
              <Input
                id="birthCountry"
                value={operator.birthCountry}
                onChange={(e) => onFieldChange("birthCountry", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nationality">Nazionalità</Label>
              <Select
                value={operator.nationality}
                onValueChange={(value) => onFieldChange("nationality", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona nazionalità" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="italiana">Italiana</SelectItem>
                  <SelectItem value="straniera">Straniera</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Sesso</Label>
              <Select
                value={operator.gender}
                onValueChange={(value) => onFieldChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona sesso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uomo">Uomo</SelectItem>
                  <SelectItem value="donna">Donna</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">In che città abiti</Label>
              <Input
                id="city"
                value={operator.city}
                onChange={(e) => onFieldChange("city", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fiscalCode">Codice Fiscale</Label>
              <Input
                id="fiscalCode"
                value={operator.fiscalCode}
                onChange={(e) => onFieldChange("fiscalCode", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vatNumber">Numero P.IVA (se in possesso)</Label>
              <Input
                id="vatNumber"
                value={operator.vatNumber}
                onChange={(e) => onFieldChange("vatNumber", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Indirizzo di residenza</Label>
              <Input
                id="address"
                value={operator.address}
                onChange={(e) => onFieldChange("address", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zipCode">CAP residenza</Label>
              <Input
                id="zipCode"
                maxLength={5}
                value={operator.zipCode}
                onChange={(e) => onFieldChange("zipCode", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="province">Provincia di residenza</Label>
              <Input
                id="province"
                value={operator.province}
                onChange={(e) => onFieldChange("province", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="residenceCity">Città di residenza</Label>
              <Input
                id="residenceCity"
                value={operator.residenceCity}
                onChange={(e) => onFieldChange("residenceCity", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* INFO */}
      <Card>
        <CardHeader>
          <CardTitle>Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Quale servizio vuoi svolgere?</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {SERVICES.map((service) => (
                <div key={service.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`service-${service.value}`} 
                    checked={operator.service?.includes(service.value as any)}
                    onCheckedChange={() => onServiceToggle(service.value)}
                  />
                  <Label 
                    htmlFor={`service-${service.value}`}
                    className="text-sm font-normal"
                  >
                    {service.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="occupation">Occupazione</Label>
            <Select
              value={operator.occupation}
              onValueChange={(value) => onFieldChange("occupation", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona occupazione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="part-time">Lavoro part-time</SelectItem>
                <SelectItem value="full-time">Lavoro full-time</SelectItem>
                <SelectItem value="studente">Studente</SelectItem>
                <SelectItem value="disoccupato">Disoccupato</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <Label>Disponibilità</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {AVAILABILITY.map((item) => (
                <div key={item.value} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`availability-${item.value}`} 
                    checked={operator.availability?.includes(item.value as any)}
                    onCheckedChange={() => onAvailabilityToggle(item.value)}
                  />
                  <Label 
                    htmlFor={`availability-${item.value}`}
                    className="text-sm font-normal"
                  >
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="drivingLicense"
                checked={operator.drivingLicense}
                onCheckedChange={(checked) => 
                  onFieldChange("drivingLicense", checked === true)
                }
              />
              <Label htmlFor="drivingLicense">Patente B?</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasVehicle"
                checked={operator.hasVehicle}
                onCheckedChange={(checked) => 
                  onFieldChange("hasVehicle", checked === true)
                }
              />
              <Label htmlFor="hasVehicle">Automunito?</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resumeFile">Carica il tuo Curriculum</Label>
            <Input
              id="resumeFile"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                if (file) {
                  onFileUpload("resumeFile", "resumeFileName", file);
                }
              }}
            />
            {operator.resumeFileName && (
              <div className="text-sm text-muted-foreground mt-1">
                File selezionato: {operator.resumeFileName}
              </div>
            )}
            {imagePreviewUrls.resumeFile && operator.resumeFile?.startsWith('data:application/pdf') && (
              <div className="mt-2">
                <a 
                  href={imagePreviewUrls.resumeFile} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Visualizza PDF
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* LINGUE */}
      <Card>
        <CardHeader>
          <CardTitle>Lingue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Lingue parlate fluentemente</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {LANGUAGES.map((language) => (
                <div key={`fluent-${language}`} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`fluent-${language}`} 
                    checked={operator.fluentLanguages?.includes(language)}
                    onCheckedChange={() => onLanguageToggle(language, 'fluent')}
                  />
                  <Label 
                    htmlFor={`fluent-${language}`}
                    className="text-sm font-normal"
                  >
                    {language}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Lingue parlate a livello base</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {LANGUAGES.map((language) => (
                <div key={`basic-${language}`} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`basic-${language}`} 
                    checked={operator.basicLanguages?.includes(language)}
                    onCheckedChange={() => onLanguageToggle(language, 'basic')}
                  />
                  <Label 
                    htmlFor={`basic-${language}`}
                    className="text-sm font-normal"
                  >
                    {language}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* CARATTERISTICHE FISICHE */}
      <Card>
        <CardHeader>
          <CardTitle>Caratteristiche Fisiche</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Altezza (cm)</Label>
              <Input
                id="height"
                type="number"
                min={140}
                max={220}
                value={operator.height}
                onChange={(e) => onFieldChange("height", Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                min={40}
                max={150}
                value={operator.weight}
                onChange={(e) => onFieldChange("weight", Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bodyType">Corporatura</Label>
              <Select
                value={operator.bodyType}
                onValueChange={(value) => onFieldChange("bodyType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona corporatura" />
                </SelectTrigger>
                <SelectContent>
                  {BODY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eyeColor">Colore occhi</Label>
              <Input
                id="eyeColor"
                value={operator.eyeColor}
                onChange={(e) => onFieldChange("eyeColor", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hairColor">Colore capelli</Label>
              <Select
                value={operator.hairColor}
                onValueChange={(value) => onFieldChange("hairColor", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona colore capelli" />
                </SelectTrigger>
                <SelectContent>
                  {HAIR_COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hairLength">Lunghezza capelli</Label>
              <Input
                id="hairLength"
                value={operator.hairLength}
                onChange={(e) => onFieldChange("hairLength", e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-8">
              <Checkbox 
                id="visibleTattoos"
                checked={operator.visibleTattoos}
                onCheckedChange={(checked) => 
                  onFieldChange("visibleTattoos", checked === true)
                }
              />
              <Label htmlFor="visibleTattoos">Tatuaggi visibili?</Label>
            </div>
          </div>
          
          <div className="space-y-4">
            <Label>Taglie di vestiti</Label>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-2">
              {SIZES.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`size-${size}`} 
                    checked={operator.sizes?.includes(size)}
                    onCheckedChange={() => onSizeToggle(size)}
                  />
                  <Label 
                    htmlFor={`size-${size}`}
                    className="text-sm font-normal"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shoeSize">Numero di scarpe</Label>
              <Input
                id="shoeSize"
                type="number"
                min={34}
                max={50}
                value={operator.shoeSize}
                onChange={(e) => onFieldChange("shoeSize", Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="chestSize">Misura petto/seno (cm)</Label>
              <Input
                id="chestSize"
                type="number"
                min={70}
                max={140}
                value={operator.chestSize}
                onChange={(e) => onFieldChange("chestSize", Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="waistSize">Misura vita (cm)</Label>
              <Input
                id="waistSize"
                type="number"
                min={60}
                max={140}
                value={operator.waistSize}
                onChange={(e) => onFieldChange("waistSize", Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hipsSize">Misura fianchi (cm)</Label>
              <Input
                id="hipsSize"
                type="number"
                min={80}
                max={150}
                value={operator.hipsSize}
                onChange={(e) => onFieldChange("hipsSize", Number(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* DOCUMENTI */}
      <Card>
        <CardHeader>
          <CardTitle>Documenti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="idCardNumber">Numero carta d'identità</Label>
              <Input
                id="idCardNumber"
                value={operator.idCardNumber}
                onChange={(e) => onFieldChange("idCardNumber", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="residencePermitNumber">Numero permesso di soggiorno (se straniero)</Label>
              <Input
                id="residencePermitNumber"
                value={operator.residencePermitNumber}
                onChange={(e) => onFieldChange("residencePermitNumber", e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="idCardFrontImage">Carta d'identità (fronte)</Label>
              <Input
                id="idCardFrontImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) {
                    onFileUpload("idCardFrontImage", "idCardFrontFileName", file);
                  }
                }}
              />
              {operator.idCardFrontFileName && (
                <div className="text-sm text-muted-foreground mt-1">
                  File selezionato: {operator.idCardFrontFileName}
                </div>
              )}
              {imagePreviewUrls.idCardFrontImage && (
                <div className="mt-2">
                  <img 
                    src={imagePreviewUrls.idCardFrontImage} 
                    alt="Anteprima carta d'identità fronte" 
                    className="max-h-40 border rounded"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="idCardBackImage">Carta d'identità (retro)</Label>
              <Input
                id="idCardBackImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) {
                    onFileUpload("idCardBackImage", "idCardBackFileName", file);
                  }
                }}
              />
              {operator.idCardBackFileName && (
                <div className="text-sm text-muted-foreground mt-1">
                  File selezionato: {operator.idCardBackFileName}
                </div>
              )}
              {imagePreviewUrls.idCardBackImage && (
                <div className="mt-2">
                  <img 
                    src={imagePreviewUrls.idCardBackImage} 
                    alt="Anteprima carta d'identità retro" 
                    className="max-h-40 border rounded"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="healthCardFrontImage">Tessera sanitaria (fronte)</Label>
              <Input
                id="healthCardFrontImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) {
                    onFileUpload("healthCardFrontImage", "healthCardFrontFileName", file);
                  }
                }}
              />
              {operator.healthCardFrontFileName && (
                <div className="text-sm text-muted-foreground mt-1">
                  File selezionato: {operator.healthCardFrontFileName}
                </div>
              )}
              {imagePreviewUrls.healthCardFrontImage && (
                <div className="mt-2">
                  <img 
                    src={imagePreviewUrls.healthCardFrontImage} 
                    alt="Anteprima tessera sanitaria fronte" 
                    className="max-h-40 border rounded"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="healthCardBackImage">Tessera sanitaria (retro)</Label>
              <Input
                id="healthCardBackImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) {
                    onFileUpload("healthCardBackImage", "healthCardBackFileName", file);
                  }
                }}
              />
              {operator.healthCardBackFileName && (
                <div className="text-sm text-muted-foreground mt-1">
                  File selezionato: {operator.healthCardBackFileName}
                </div>
              )}
              {imagePreviewUrls.healthCardBackImage && (
                <div className="mt-2">
                  <img 
                    src={imagePreviewUrls.healthCardBackImage} 
                    alt="Anteprima tessera sanitaria retro" 
                    className="max-h-40 border rounded"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* FOTO PROFILO */}
      <Card>
        <CardHeader>
          <CardTitle>Foto profilo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="facePhotoFile">Foto viso</Label>
              <Input
                id="facePhotoFile"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) {
                    onFileUpload("facePhotoFile", "facePhotoFileName", file);
                  }
                }}
              />
              {operator.facePhotoFileName && (
                <div className="text-sm text-muted-foreground mt-1">
                  File selezionato: {operator.facePhotoFileName}
                </div>
              )}
              {imagePreviewUrls.facePhotoFile && (
                <div className="mt-2">
                  <img 
                    src={imagePreviewUrls.facePhotoFile} 
                    alt="Anteprima foto viso" 
                    className="max-h-60 border rounded"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bustPhotoFile">Foto busto</Label>
              <Input
                id="bustPhotoFile"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) {
                    onFileUpload("bustPhotoFile", "bustPhotoFileName", file);
                  }
                }}
              />
              {operator.bustPhotoFileName && (
                <div className="text-sm text-muted-foreground mt-1">
                  File selezionato: {operator.bustPhotoFileName}
                </div>
              )}
              {imagePreviewUrls.bustPhotoFile && (
                <div className="mt-2">
                  <img 
                    src={imagePreviewUrls.bustPhotoFile} 
                    alt="Anteprima foto busto" 
                    className="max-h-60 border rounded"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullBodyPhotoFile">Foto figura intera</Label>
              <Input
                id="fullBodyPhotoFile"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) {
                    onFileUpload("fullBodyPhotoFile", "fullBodyPhotoFileName", file);
                  }
                }}
              />
              {operator.fullBodyPhotoFileName && (
                <div className="text-sm text-muted-foreground mt-1">
                  File selezionato: {operator.fullBodyPhotoFileName}
                </div>
              )}
              {imagePreviewUrls.fullBodyPhotoFile && (
                <div className="mt-2">
                  <img 
                    src={imagePreviewUrls.fullBodyPhotoFile} 
                    alt="Anteprima foto figura intera" 
                    className="max-h-60 border rounded"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* DATI BANCARI */}
      <Card>
        <CardHeader>
          <CardTitle>Dati bancari</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountHolder">Intestatario conto</Label>
              <Input
                id="accountHolder"
                value={operator.accountHolder}
                onChange={(e) => onFieldChange("accountHolder", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bankName">Nome banca</Label>
              <Input
                id="bankName"
                value={operator.bankName}
                onChange={(e) => onFieldChange("bankName", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="iban">IBAN</Label>
              <Input
                id="iban"
                value={operator.iban}
                onChange={(e) => onFieldChange("iban", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bic">BIC/SWIFT</Label>
              <Input
                id="bic"
                value={operator.bic}
                onChange={(e) => onFieldChange("bic", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Numero conto</Label>
              <Input
                id="accountNumber"
                value={operator.accountNumber}
                onChange={(e) => onFieldChange("accountNumber", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* SOCIAL */}
      <Card>
        <CardHeader>
          <CardTitle>Social</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center">
                <Instagram className="mr-2 h-4 w-4" />
                Instagram
              </Label>
              <Input
                id="instagram"
                value={operator.instagram}
                onChange={(e) => onFieldChange("instagram", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="facebook" className="flex items-center">
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Label>
              <Input
                id="facebook"
                value={operator.facebook}
                onChange={(e) => onFieldChange("facebook", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tiktok" className="flex items-center">
                <span className="mr-2">TikTok</span>
              </Label>
              <Input
                id="tiktok"
                value={operator.tiktok}
                onChange={(e) => onFieldChange("tiktok", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center">
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                value={operator.linkedin}
                onChange={(e) => onFieldChange("linkedin", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoTab;
