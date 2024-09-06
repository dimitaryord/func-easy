import React, { useState } from 'react';

type TreeItemProps = {
  icon?: React.ReactNode;
  label: React.ReactNode;
  children?: React.ReactNode;
};

export const TreeItem: React.FC<TreeItemProps> = ({ icon, label, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="tree-item">
      <div className="tree-item-trigger" onClick={() => setIsOpen(!isOpen)}>
        {icon && <span className="tree-item-icon">{icon}</span>}
        {label}
      </div>
      {isOpen && children && <div className="tree-item-content">{children}</div>}
    </div>
  );
};

type TreeViewProps = {
  children: React.ReactNode;
};

export const TreeView: React.FC<TreeViewProps> = ({ children }) => {
  return <div className="tree-view">{children}</div>;
};