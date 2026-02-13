import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Download, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface BulkActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkEdit?: () => void;
  onBulkExport?: () => void;
  onClearSelection: () => void;
}

export function BulkActions({
  selectedCount,
  onBulkDelete,
  onBulkEdit,
  onBulkExport,
  onClearSelection,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3 flex items-center gap-4">
        <Badge variant="secondary" className="text-sm">
          {selectedCount} επιλεγμένο{selectedCount > 1 ? 'α' : ''}
        </Badge>
        <div className="flex items-center gap-2">
          {onBulkEdit && (
            <Button variant="outline" size="sm" onClick={onBulkEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Επεξεργασία
            </Button>
          )}
          {onBulkExport && (
            <Button variant="outline" size="sm" onClick={onBulkExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
          <Button variant="destructive" size="sm" onClick={onBulkDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Διαγραφή
          </Button>
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
