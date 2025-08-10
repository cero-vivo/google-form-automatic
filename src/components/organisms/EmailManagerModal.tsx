'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search,
  X, 
  Check, 
  Trash2, 
  Edit3,
  CheckSquare,
  MoreVertical,
  Mail,
  Upload
} from 'lucide-react';

interface EmailManagerModalProps {
  emails: string[];
  selectedEmails: string[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onToggleSelection: (email: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
  onDeleteSingle: (email: string) => void;
  onDeleteAll: () => void;
  onEditEmail: (oldEmail: string, newEmail: string) => void;
  onImportEmails?: (file: File) => void;
  isUploading?: boolean;
  onClose: () => void;
}

export default function EmailManagerModal({
  emails,
  selectedEmails,
  searchTerm,
  onSearchChange,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  onDeleteSelected,
  onDeleteSingle,
  onDeleteAll,
  onEditEmail,
  onImportEmails,
  isUploading = false,
  onClose
}: EmailManagerModalProps) {
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const filteredEmails = emails.filter(email => 
    email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAllSelected = filteredEmails.length > 0 && filteredEmails.every(email => selectedEmails.includes(email));
  const hasSelection = selectedEmails.length > 0;

  const startEdit = (email: string) => {
    setEditingEmail(email);
    setEditValue(email);
  };

  const cancelEdit = () => {
    setEditingEmail(null);
    setEditValue('');
  };

  const saveEdit = () => {
    if (editingEmail && editValue.trim() && editValue !== editingEmail) {
      onEditEmail(editingEmail, editValue.trim());
    }
    cancelEdit();
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Gestionar Emails ({emails.length})
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Barra de búsqueda y botón de importar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar emails..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {onImportEmails && (
              <>
                <input
                  type="file"
                  id="modal-email-file-upload"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onImportEmails(file);
                    }
                    e.target.value = '';
                  }}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('modal-email-file-upload')?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-2"
                >
                  {isUploading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Importar
                </Button>
              </>
            )}
          </div>

          {/* Acciones en lote */}
          {emails.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
              <Button
                variant="outline"
                size="sm"
                onClick={isAllSelected ? onClearSelection : onSelectAll}
                className="flex items-center gap-2"
              >
                {isAllSelected ? <X className="h-3 w-3" /> : <CheckSquare className="h-3 w-3" />}
                {isAllSelected ? 'Deseleccionar' : 'Seleccionar'} todos
              </Button>

              {hasSelection && (
                <>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={onDeleteSelected}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-3 w-3" />
                    Eliminar seleccionados ({selectedEmails.length})
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClearSelection}
                    className="flex items-center gap-2"
                  >
                    <X className="h-3 w-3" />
                    Limpiar selección
                  </Button>
                </>
              )}

              <Button
                variant="destructive"
                size="sm"
                onClick={onDeleteAll}
                className="flex items-center gap-2 ml-auto"
              >
                <Trash2 className="h-3 w-3" />
                Eliminar todos
              </Button>
            </div>
          )}

          {/* Lista de emails */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredEmails.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {emails.length === 0 ? (
                  <div>
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay emails agregados</p>
                  </div>
                ) : (
                  <div>
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No se encontraron emails que coincidan con "{searchTerm}"</p>
                  </div>
                )}
              </div>
            ) : (
              filteredEmails.map((email, index) => (
                <div
                  key={email}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    selectedEmails.includes(email)
                      ? 'bg-primary/10 border-primary'
                      : 'bg-background hover:bg-muted/50'
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => onToggleSelection(email)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      selectedEmails.includes(email)
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-muted-foreground hover:border-primary'
                    }`}
                  >
                    {selectedEmails.includes(email) && <Check className="h-3 w-3" />}
                  </button>

                  {/* Email content */}
                  <div className="flex-1 min-w-0">
                    {editingEmail === email ? (
                      <div className="flex gap-2">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyPress={handleEditKeyPress}
                          onBlur={saveEdit}
                          className="text-sm"
                          autoFocus
                        />
                        <Button size="sm" variant="ghost" onClick={saveEdit}>
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{email}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {editingEmail !== email && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(email)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteSingle(email)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        title={`Eliminar ${email}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer stats */}
          {emails.length > 0 && (
            <div className="flex justify-between items-center pt-3 border-t text-sm text-muted-foreground">
              <span>
                Mostrando {filteredEmails.length} de {emails.length} emails
              </span>
              {hasSelection && (
                <span>
                  {selectedEmails.length} seleccionado{selectedEmails.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 