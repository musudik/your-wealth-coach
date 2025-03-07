import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import styles from './styles/form.module.css';

export function RealEstateForm() {
  const { t } = useTranslation('realEstate');
  
  return (
    <div className={styles.formContainer}>
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-orange-600">
            {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Form fields will go here */}
        </CardContent>
      </Card>
    </div>
  );
} 