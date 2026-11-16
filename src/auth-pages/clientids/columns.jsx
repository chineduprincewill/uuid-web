import React from 'react';

export function generateColumns(fields) {
  // 1. Generate the dynamic columns from the API response
  const dynamicColumns = fields.map((field) => ({
    accessorKey: field.field_name,
    header: field.display_name,
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ row }) => {
      const value = row.original[field.field_name] ?? row.original.fields?.[field.field_name];
      
      if (!value) return <span className="text-muted-foreground">—</span>;
      
      return (
        <div className="w-32">
          <p className="truncate font-extralight" title={String(value)}>
            {value}
          </p>
        </div>
      );
    },
  }));

  // 2. Define the new static columns
  const staticColumns = [
    {
      accessorKey: 'uid',
      header: 'UID',
      enableSorting: true,
      enableColumnFilter: true,
      cell: ({ row }) => {
        const value = row.original.uid;
        if (!value) return <span className="text-muted-foreground">—</span>;
        return (
          <div className="w-32">
            <p className="truncate font-extralight" title={String(value)}>{value}</p>
          </div>
        );
      },
    },
  ];

  const endColumns = [
    {
      accessorKey: 'created_by',
      header: 'Created By',
      enableSorting: true,
      enableColumnFilter: true,
      cell: ({ row }) => {
        const value = row.original.created_by;
        if (!value) return <span className="text-muted-foreground">—</span>;
        return (
          <div className="w-40">
            <p className="truncate font-extralight" title={String(value)}>{value}</p>
          </div>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Date Created',
      enableSorting: true,
      enableColumnFilter: true,
      cell: ({ row }) => {
        const value = row.original.created_at;
        if (!value) return <span className="text-muted-foreground">—</span>;
        
        // Format the date to be more readable
        const date = new Date(value);
        const formattedDate = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        return <span className="whitespace-nowrap font-extralight">{formattedDate}</span>;
      },
    },
  ];

  // 3. Combine them. 
  // (Change the order if you want UID first, or Created At last, etc.)
  return [...staticColumns, ...dynamicColumns, ...endColumns];
}