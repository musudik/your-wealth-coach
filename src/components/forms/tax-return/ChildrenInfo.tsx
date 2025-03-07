import React, { useState } from 'react';
import languageData from './i18n/language.json';
import { Label } from '@/components/ui/label';

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  taxId: string;
}

interface ChildrenInfoProps {
  onChange: (children: Child[]) => void;
}

const ChildrenInfo: React.FC<ChildrenInfoProps> = ({ onChange }) => {
  const [children, setChildren] = useState<Child[]>([
    { id: '1', firstName: '', lastName: '', dateOfBirth: '', taxId: '' }
  ]);

  const handleAddChild = () => {
    const newChild: Child = {
      id: (children.length + 1).toString(),
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      taxId: ''
    };
    const updatedChildren = [...children, newChild];
    setChildren(updatedChildren);
    onChange(updatedChildren);
  };

  const handleRemoveChild = (id: string) => {
    if (children.length > 1) {
      const updatedChildren = children.filter(child => child.id !== id);
      setChildren(updatedChildren);
      onChange(updatedChildren);
    }
  };

  const handleChildChange = (id: string, field: keyof Child, value: string) => {
    const updatedChildren = children.map(child => {
      if (child.id === id) {
        return { ...child, [field]: value };
      }
      return child;
    });
    setChildren(updatedChildren);
    onChange(updatedChildren);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-semibold mb-4">
        {languageData.de.children.title}
        <span className="text-sm font-medium block mt-1 text-gray-600">{languageData.en.children.title}</span>
      </h2>
      
      {children.map((child, index) => (
        <div key={child.id} className="mb-6 p-4 border border-gray-200 rounded-md">
          <h3 className="text-lg font-medium mb-3">
            {languageData.de.children.child} {index + 1}
            <span className="text-sm font-medium block mt-1 text-gray-600">{languageData.en.children.child} {index + 1}</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="block space-y-1 mb-1">
                <span>{languageData.de.children.firstName}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.children.firstName}</span>
              </Label>
              <input
                type="text"
                value={child.firstName}
                onChange={(e) => handleChildChange(child.id, 'firstName', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <Label className="block space-y-1 mb-1">
                <span>{languageData.de.children.lastName}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.children.lastName}</span>
              </Label>
              <input
                type="text"
                value={child.lastName}
                onChange={(e) => handleChildChange(child.id, 'lastName', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <Label className="block space-y-1 mb-1">
                <span>{languageData.de.children.dateOfBirth}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.children.dateOfBirth}</span>
              </Label>
              <input
                type="date"
                value={child.dateOfBirth}
                onChange={(e) => handleChildChange(child.id, 'dateOfBirth', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <Label className="block space-y-1 mb-1">
                <span>{languageData.de.children.taxId}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.children.taxId}</span>
              </Label>
              <input
                type="text"
                value={child.taxId}
                onChange={(e) => handleChildChange(child.id, 'taxId', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {children.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveChild(child.id)}
              className="mt-3 text-sm text-red-600 hover:text-red-800"
            >
              {languageData.de.children.remove} / {languageData.en.children.remove}
            </button>
          )}
        </div>
      ))}
      
      <button
        type="button"
        onClick={handleAddChild}
        className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {languageData.de.children.add} / {languageData.en.children.add}
      </button>
    </div>
  );
};

export default ChildrenInfo;
