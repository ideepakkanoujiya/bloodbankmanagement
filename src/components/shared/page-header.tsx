interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
  }
  
  export default function PageHeader({ title, description, actions }: PageHeaderProps) {
    return (
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            {title}
          </h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    );
  }
  