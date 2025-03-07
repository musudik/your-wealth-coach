import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import languageData from "@/components/forms/self-disclosure/i18n/language.json";
import { FormData } from "@/types/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Plus, Minus } from "lucide-react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { nanoid } from "nanoid";

interface PersonalInfoFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  errors: Record<string, any>;
  isSingleApplicant: boolean;
}

interface Child {
  id: string;
  name: string;
  birthDate: string;
  placeOfBirth: string;
}

interface ApplicantChildren {
  hasChildren: boolean;
  children: Child[];
}

// Helper component for the dual-language select options
const SelectOption = ({ value, de, en }: { value: string; de: string; en: string }) => (
  <SelectItem value={value}>
    {de} ({en})
  </SelectItem>
);

export function PersonalInfoForm({ formData, setFormData, errors, isSingleApplicant }: PersonalInfoFormProps) {
  const handleDateChange = (applicant: 'applicantA' | 'applicantB', field: string, date: Date | undefined) => {
    if (!date) return;
    
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [applicant]: {
          ...formData.personalInfo[applicant],
          [field]: format(date, 'yyyy-MM-dd'),
        },
      },
    });
  };

  const handleChildrenChange = (applicant: 'applicantA' | 'applicantB', hasChildren: boolean) => {
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [applicant]: {
          ...formData.personalInfo[applicant],
          hasChildren,
          children: hasChildren ? [{ id: crypto.randomUUID(), name: '', birthDate: '', placeOfBirth: '' }] : []
        }
      }
    });
  };

  const addChild = (applicant: 'applicantA' | 'applicantB') => {
    setFormData((prevData) => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        [applicant]: {
          ...prevData.personalInfo[applicant],
          children: [
            ...prevData.personalInfo[applicant].children,
            {
              id: nanoid(),
              name: '',
              birthDate: '',
              placeOfBirth: ''
            }
          ]
        }
      }
    }));
  };

  const removeChild = (applicant: 'applicantA' | 'applicantB', childId: string) => {
    setFormData((prevData) => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        [applicant]: {
          ...prevData.personalInfo[applicant],
          children: prevData.personalInfo[applicant].children.filter(
            (child) => child.id !== childId
          )
        }
      }
    }));
  };

  const updateChild = (
    applicant: 'applicantA' | 'applicantB',
    childId: string,
    field: 'name' | 'birthDate' | 'placeOfBirth',
    value: string
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        [applicant]: {
          ...prevData.personalInfo[applicant],
          children: prevData.personalInfo[applicant].children.map((child) =>
            child.id === childId ? { ...child, [field]: value } : child
          )
        }
      }
    }));
  };

  const handleNationalityChange = (applicant: 'applicantA' | 'applicantB', value: string) => {
    // If the value is not "other", clear any custom nationality value
    const otherNationalityField = applicant === 'applicantA' ? 'otherNationality' : 'otherNationalityB';
    
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [applicant]: {
          ...formData.personalInfo[applicant],
          nationality: value,
          [otherNationalityField]: value === 'other' ? formData.personalInfo[applicant][otherNationalityField] || '' : '',
        },
      },
    });
  };

  const handleOtherNationalityChange = (applicant: 'applicantA' | 'applicantB', value: string) => {
    const otherNationalityField = applicant === 'applicantA' ? 'otherNationality' : 'otherNationalityB';
    
    // Store both the "other" selection and the custom value
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [applicant]: {
          ...formData.personalInfo[applicant],
          nationality: 'other', // Keep the dropdown on "other"
          [otherNationalityField]: value, // Store the custom value
          actualNationality: value, // Store the actual value to use
        },
      },
    });
  };

  const handleOccupationChange = (applicant: 'applicantA' | 'applicantB', value: string) => {
    // If the value is not "other", clear any custom occupation value
    const otherOccupationField = applicant === 'applicantA' ? 'otherOccupation' : 'otherOccupationB';
    
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [applicant]: {
          ...formData.personalInfo[applicant],
          occupation: value,
          [otherOccupationField]: value === 'other' ? formData.personalInfo[applicant][otherOccupationField] || '' : '',
        },
      },
    });
  };

  const handleOtherOccupationChange = (applicant: 'applicantA' | 'applicantB', value: string) => {
    const otherOccupationField = applicant === 'applicantA' ? 'otherOccupation' : 'otherOccupationB';
    
    // Store both the "other" selection and the custom value
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [applicant]: {
          ...formData.personalInfo[applicant],
          occupation: 'other', // Keep the dropdown on "other"
          [otherOccupationField]: value, // Store the custom value
          actualOccupation: value, // Store the actual value to use
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Applicant A */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {languageData.de.credit_applicant_a}
            <br />
            <span className="text-sm text-gray-600">{languageData.en.credit_applicant_a}</span>
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.first_last_name}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.first_last_name}</span>
              </Label>
              <Input
                value={formData.personalInfo.applicantA.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      applicantA: {
                        ...formData.personalInfo.applicantA,
                        name: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantA?.name ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.birth_name}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.birth_name}</span>
              </Label>
              <Input
                value={formData.personalInfo.applicantA.birthName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      applicantA: {
                        ...formData.personalInfo.applicantA,
                        birthName: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantA?.birthName ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.address}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.address}</span>
              </Label>
              <Input
                value={formData.personalInfo.applicantA.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      applicantA: {
                        ...formData.personalInfo.applicantA,
                        address: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantA?.address ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.telephone_number}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.telephone_number}</span>
              </Label>
              <Input
                value={formData.personalInfo.applicantA.telephone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      applicantA: {
                        ...formData.personalInfo.applicantA,
                        telephone: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantA?.telephone ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.email_id}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.email_id}</span>
              </Label>
              <Input
                type="email"
                value={formData.personalInfo.applicantA.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      applicantA: {
                        ...formData.personalInfo.applicantA,
                        email: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantA?.email ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.date_of_birth}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.date_of_birth}</span>
              </Label>
              <Input
                type="date"
                value={formData.personalInfo.applicantA.birthDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      applicantA: {
                        ...formData.personalInfo.applicantA,
                        birthDate: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantA?.birthDate ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.place_of_birth}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.place_of_birth}</span>
              </Label>
              <Input
                value={formData.personalInfo.applicantA.placeOfBirth}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      applicantA: {
                        ...formData.personalInfo.applicantA,
                        placeOfBirth: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantA?.placeOfBirth ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.nationality}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.nationality}</span>
              </Label>
              <Select
                value={formData.personalInfo.applicantA.nationality}
                onValueChange={(value) =>
                  handleNationalityChange('applicantA', value)
                }
              >
                <SelectTrigger className={errors?.applicantA?.nationality ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(languageData.de.nationality_options).map(([key, de]) => (
                    <SelectOption 
                      key={key}
                      value={key} 
                      de={de} 
                      en={languageData.en.nationality_options[key]} 
                    />
                  ))}
                </SelectContent>
              </Select>
              {formData.personalInfo.applicantA.nationality === "other" && (
                <div className="mt-2">
                  <Label className="block space-y-1">
                    <span>{languageData.de.other_nationality}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.other_nationality}</span>
                  </Label>
                  <Input
                    value={formData.personalInfo.applicantA.otherNationality || ""}
                    onChange={(e) =>
                      handleOtherNationalityChange('applicantA', e.target.value)
                    }
                    className={errors?.applicantA?.otherNationality ? "border-red-500" : ""}
                  />
                </div>
              )}
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.marital_status}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.marital_status}</span>
              </Label>
              <Select
                value={formData.personalInfo.applicantA.maritalStatus}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      applicantA: {
                        ...formData.personalInfo.applicantA,
                        maritalStatus: value,
                      },
                    },
                  })
                }
              >
                <SelectTrigger className={errors?.applicantA?.maritalStatus ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(languageData.de.marital_status_options).map(([key, de]) => (
                    <SelectOption 
                      key={key}
                      value={key} 
                      de={de} 
                      en={languageData.en.marital_status_options[key]} 
                    />
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.has_children}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.has_children}</span>
              </Label>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="hasChildrenA"
                  checked={formData.personalInfo.applicantA.hasChildren}
                  onCheckedChange={(checked) => 
                    handleChildrenChange('applicantA', checked as boolean)
                  }
                />
              </div>
            </div>
            {formData.personalInfo.applicantA.hasChildren && (
              <div className="mt-4 space-y-4">
                {formData.personalInfo.applicantA.children.map((child) => (
                  <div>
                    <div>
                      <Label className="block space-y-1">
                        <span>{languageData.de.child_name}</span>
                        <span className="text-sm text-gray-600 block">{languageData.en.child_name}</span>
                      </Label>
                      <Input
                        value={child.name}
                        onChange={(e) => updateChild('applicantA', child.id, 'name', e.target.value)}
                        className={errors?.applicantA?.children ? "border-red-500" : ""}
                      />
                    </div>
                    <div key={child.id} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-end">
                      <div>
                        <Label className="text-sm">
                          {languageData.de.child_dob}
                          <span className="text-sm text-gray-600 block">{languageData.en.child_dob}</span>
                        </Label>
                        <Input
                          type="date"
                          value={child.birthDate}
                          onChange={(e) => updateChild('applicantA', child.id, 'birthDate', e.target.value)}
                          className={errors?.applicantA?.children ? "border-red-500" : ""}
                        />
                      </div>
                      <div>
                      <Label className="text-sm">
                          {languageData.de.child_place_of_birth}
                          <span className="text-sm text-gray-600 block">{languageData.en.child_place_of_birth}</span>
                        </Label>
                      <Input
                        value={child.placeOfBirth}
                        onChange={(e) => updateChild('applicantA', child.id, 'placeOfBirth', e.target.value)}
                        className={errors?.applicantA?.children ? "border-red-500" : ""}
                      />    
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeChild('applicantA', child.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addChild('applicantA')}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {languageData.de.add_child}
                </Button>
              </div>
            )}
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.occupation}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.occupation}</span>
              </Label>
              <Select
                value={formData.personalInfo.applicantA.occupation}
                onValueChange={(value) =>
                  handleOccupationChange('applicantA', value)
                }
              >
                <SelectTrigger className={errors?.applicantA?.occupation ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select occupation" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(languageData.de.occupation_options).map(([key, de]) => (
                    <SelectOption 
                      key={key}
                      value={key} 
                      de={de} 
                      en={languageData.en.occupation_options[key]} 
                    />
                  ))}
                </SelectContent>
              </Select>
              {formData.personalInfo.applicantA.occupation === "other" && (
                <div className="mt-2">
                  <Label className="block space-y-1">
                    <span>{languageData.de.other_occupation}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.other_occupation}</span>
                  </Label>
                  <Input
                    value={formData.personalInfo.applicantA.otherOccupation || ""}
                    onChange={(e) =>
                      handleOtherOccupationChange('applicantA', e.target.value)
                    }
                    className={errors?.applicantA?.otherOccupation ? "border-red-500" : ""}
                  />
                </div>
              )}
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.occupation_since}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.occupation_since}</span>
              </Label>
              <Input
                type="date"
                value={formData.personalInfo.applicantA.occupationSince}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      applicantA: {
                        ...formData.personalInfo.applicantA,
                        occupationSince: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantA?.occupationSince ? "border-red-500" : ""}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.bank_details_iban}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.bank_details_iban}</span>
              </Label>
              <Input
                value={formData.personalInfo.applicantA.bankDetails}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      applicantA: {
                        ...formData.personalInfo.applicantA,
                        bankDetails: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantA?.bankDetails ? "border-red-500" : ""}
              />
            </div>
          </div>
        </div>

        {/* Applicant B - Same fields as A */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {languageData.de.credit_applicant_b}
            <br />
            <span className="text-sm text-gray-600">{languageData.en.credit_applicant_b}</span>
          </h3>
          <div className="space-y-4">
            {/* Copy all the same fields as Applicant A, but use applicantB in the formData */}
            {/* ... Same structure as Applicant A, but with B fields ... */}
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.first_last_name}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.first_last_name}</span>
              </Label>
              <Input
                value={formData.personalInfo.applicantB.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      applicantB: {
                        ...formData.personalInfo.applicantB,
                        name: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantB?.name ? "border-red-500" : ""}
                disabled={isSingleApplicant}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.birth_name}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.birth_name}</span>
              </Label>
              <Input
                value={formData.personalInfo.applicantB.birthName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      applicantB: {
                        ...formData.personalInfo.applicantB,
                        birthName: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantB?.birthName ? "border-red-500" : ""}
                disabled={isSingleApplicant}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.address}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.address}</span>
              </Label>
              <Input
                value={formData.personalInfo.applicantB.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      applicantB: {
                        ...formData.personalInfo.applicantB,
                        address: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantB?.address ? "border-red-500" : ""}
                disabled={isSingleApplicant}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.telephone_number}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.telephone_number}</span>
              </Label>
              <Input
                value={formData.personalInfo.applicantB.telephone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      applicantB: {
                        ...formData.personalInfo.applicantB,
                        telephone: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantB?.telephone ? "border-red-500" : ""}
                disabled={isSingleApplicant}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.email_id}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.email_id}</span>
              </Label>
              <Input
                type="email"
                value={formData.personalInfo.applicantB.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      applicantB: {
                        ...formData.personalInfo.applicantB,
                        email: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantB?.email ? "border-red-500" : ""}
                disabled={isSingleApplicant}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.date_of_birth}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.date_of_birth}</span>
              </Label>
              <Input
                type="date"
                value={formData.personalInfo.applicantB.birthDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      applicantB: {
                        ...formData.personalInfo.applicantB,
                        birthDate: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantB?.birthDate ? "border-red-500" : ""}
                disabled={isSingleApplicant}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.place_of_birth}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.place_of_birth}</span>
              </Label>
              <Input
                value={formData.personalInfo.applicantB.placeOfBirth}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      applicantB: {
                        ...formData.personalInfo.applicantB,
                        placeOfBirth: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantB?.placeOfBirth ? "border-red-500" : ""}
                disabled={isSingleApplicant}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.nationality}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.nationality}</span>
              </Label>
              <Select
                value={formData.personalInfo.applicantB.nationality}
                onValueChange={(value) =>
                  handleNationalityChange('applicantB', value)
                }
                disabled={isSingleApplicant}
              >
                <SelectTrigger className={errors?.applicantB?.nationality ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(languageData.de.nationality_options).map(([key, de]) => (
                    <SelectOption 
                      key={key}
                      value={key} 
                      de={de} 
                      en={languageData.en.nationality_options[key]} 
                    />
                  ))}
                </SelectContent>
              </Select>
              {formData.personalInfo.applicantB.nationality === "other" && (
                <div className="mt-2">
                  <Label className="block space-y-1">
                    <span>{languageData.de.other_nationality}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.other_nationality}</span>
                  </Label>
                  <Input
                    value={formData.personalInfo.applicantB.otherNationalityB || ""}
                    onChange={(e) =>
                      handleOtherNationalityChange('applicantB', e.target.value)
                    }
                    className={errors?.applicantB?.otherNationalityB ? "border-red-500" : ""}
                    disabled={isSingleApplicant}
                  />
                </div>
              )}
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.marital_status}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.marital_status}</span>
              </Label>
              <Select
                value={formData.personalInfo.applicantB.maritalStatus}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      applicantB: {
                        ...formData.personalInfo.applicantB,
                        maritalStatus: value,
                      },
                    },
                  })
                }
                disabled={isSingleApplicant}
              >
                <SelectTrigger className={errors?.applicantB?.maritalStatus ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(languageData.de.marital_status_options).map(([key, de]) => (
                    <SelectOption 
                      key={key}
                      value={key} 
                      de={de} 
                      en={languageData.en.marital_status_options[key]} 
                    />
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.has_children}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.has_children}</span>
              </Label>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="hasChildrenB"
                  checked={formData.personalInfo.applicantB.hasChildren}
                  onCheckedChange={(checked) => 
                    handleChildrenChange('applicantB', checked as boolean)
                  }
                  disabled={isSingleApplicant}
                />
              </div>
            </div>
            {formData.personalInfo.applicantB.hasChildren && (
              <div className="mt-4 space-y-4">
                {formData.personalInfo.applicantB.children.map((child) => (
                  <div>
                    <div>
                      <Label className="block space-y-1">
                        <span>{languageData.de.child_name}</span>
                        <span className="text-sm text-gray-600 block">{languageData.en.child_name}</span>
                      </Label>
                      <Input
                        value={child.name}
                        onChange={(e) => updateChild('applicantB', child.id, 'name', e.target.value)}
                        className={errors?.applicantB?.children ? "border-red-500" : ""}
                        disabled={isSingleApplicant}
                      />
                    </div>
                    <div key={child.id} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-end">
                      <div>
                        <Label className="text-sm">
                          {languageData.de.child_dob}
                          <span className="text-sm text-gray-600 block">{languageData.en.child_dob}</span>
                        </Label>
                        <Input
                          type="date"
                          value={child.birthDate}
                          onChange={(e) => updateChild('applicantB', child.id, 'birthDate', e.target.value)}
                          className={errors?.applicantB?.children ? "border-red-500" : ""}
                          disabled={isSingleApplicant}
                        />
                      </div>
                      <div>
                      <Label className="text-sm">
                          {languageData.de.child_place_of_birth}
                          <span className="text-sm text-gray-600 block">{languageData.en.child_place_of_birth}</span>
                        </Label>
                      <Input
                        value={child.placeOfBirth}
                        onChange={(e) => updateChild('applicantB', child.id, 'placeOfBirth', e.target.value)}
                        className={errors?.applicantB?.children ? "border-red-500" : ""}
                        disabled={isSingleApplicant}
                      />  
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeChild('applicantB', child.id)}
                      disabled={isSingleApplicant}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addChild('applicantB')}
                  className="mt-2"
                  disabled={isSingleApplicant}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {languageData.de.add_child}
                </Button>
              </div>
            )}
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.occupation}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.occupation}</span>
              </Label>
              <Select
                value={formData.personalInfo.applicantB.occupation}
                onValueChange={(value) =>
                  handleOccupationChange('applicantB', value)
                }
                disabled={isSingleApplicant}
              >
                <SelectTrigger className={errors?.applicantB?.occupation ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select occupation" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(languageData.de.occupation_options).map(([key, de]) => (
                    <SelectOption 
                      key={key}
                      value={key} 
                      de={de} 
                      en={languageData.en.occupation_options[key]} 
                    />
                  ))}
                </SelectContent>
              </Select>
              {formData.personalInfo.applicantB.occupation === "other" && (
                <div className="mt-2">
                  <Label className="block space-y-1">
                    <span>{languageData.de.other_occupation}</span>
                    <span className="text-sm text-gray-600 block">{languageData.en.other_occupation}</span>
                  </Label>
                  <Input
                    value={formData.personalInfo.applicantB.otherOccupationB || ""}
                    onChange={(e) =>
                      handleOtherOccupationChange('applicantB', e.target.value)
                    }
                    className={errors?.applicantB?.otherOccupationB ? "border-red-500" : ""}
                    disabled={isSingleApplicant}
                  />
                </div>
              )}
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.occupation_since}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.occupation_since}</span>
              </Label>
              <Input
                type="date"
                value={formData.personalInfo.applicantB.occupationSince}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      applicantB: {
                        ...formData.personalInfo.applicantB,
                        occupationSince: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantB?.occupationSince ? "border-red-500" : ""}
                disabled={isSingleApplicant}
              />
            </div>
            <div>
              <Label className="block space-y-1">
                <span>{languageData.de.bank_details_iban}</span>
                <span className="text-sm text-gray-600 block">{languageData.en.bank_details_iban}</span>
              </Label>
              <Input
                value={formData.personalInfo.applicantB.bankDetails}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      applicantB: {
                        ...formData.personalInfo.applicantB,
                        bankDetails: e.target.value,
                      },
                    },
                  })
                }
                className={errors?.applicantB?.bankDetails ? "border-red-500" : ""}
                disabled={isSingleApplicant}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 