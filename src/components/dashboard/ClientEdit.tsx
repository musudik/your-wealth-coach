import { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import languageData from "../../i18n/language.json";
import "../../styles/forms.css"; // Import the global form styles
import { validateClientDetails, hasValidationErrors } from "./validation";
import { firestore } from "../../db-services/firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ClientService } from "../../db-services/clientService";

interface PersonDetails {
  id?: string;
  firstName: string;
  lastName: string;
  birthName: string;
  address: string;
  telephone: string;
  email: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  maritalStatus: string;
  occupation: string;
  occupationSince: string;
}

interface ClientDetails extends PersonDetails {
  partnerId: string;
  hasSpouse: boolean;
  spouseDetails?: PersonDetails;
  createdAt: string;
  updatedAt: string;
}

export default function ClientEdit() {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasSpouse, setHasSpouse] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [partnerId, setPartnerId] = useState<string>('');
  const auth = getAuth();
  const isMounted = useRef(true);

  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    id: id !== 'new' ? id : undefined,
    firstName: '',
    lastName: '',
    birthName: '',
    address: '',
    telephone: '',
    email: '',
    dateOfBirth: '',
    placeOfBirth: '',
    nationality: '',
    maritalStatus: '',
    occupation: '',
    occupationSince: '',
    partnerId: '',
    hasSpouse: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    // Set up the isMounted ref for cleanup
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Listen for auth state changes to get the partnerId
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isMounted.current) {
        const uid = user.uid;
        setPartnerId(uid);
        setClientDetails(prev => ({
          ...prev,
          partnerId: uid
        }));
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchClientDetails();
    } else {
      setLoading(false);
    }
  }, [id, partnerId]);

  const fetchClientDetails = async () => {
    if (!partnerId) return; // Don't fetch if partnerId is not available yet
    
    try {
      setLoading(true);
      
      // Use Firestore directly
      const clientDoc = await getDoc(doc(firestore, 'clients', id));
      
      if (clientDoc.exists()) {
        const client = clientDoc.data();
        
        // Convert the Firestore client format to our component's format
        const clientData: ClientDetails = {
          id: client.clientId,
          firstName: client.personalInformation?.firstName || '',
          lastName: client.personalInformation?.lastName || '',
          birthName: client.personalInformation?.birthName || '',
          address: client.contactInformation?.address || '',
          telephone: client.contactInformation?.phone || '',
          email: client.contactInformation?.email || '',
          dateOfBirth: client.personalInformation?.dateOfBirth || '',
          placeOfBirth: client.personalInformation?.placeOfBirth || '',
          nationality: client.personalInformation?.nationality || '',
          maritalStatus: client.personalInformation?.maritalStatus || '',
          occupation: client.professionalInformation?.occupation || '',
          occupationSince: client.professionalInformation?.occupationSince || '',
          partnerId: client.partnerId || partnerId,
          hasSpouse: !!client.spouseInformation,
          createdAt: client.createdAt || new Date().toISOString(),
          updatedAt: client.updatedAt || new Date().toISOString(),
        };

        if (client.spouseInformation) {
          clientData.spouseDetails = {
            firstName: client.spouseInformation.firstName || '',
            lastName: client.spouseInformation.lastName || '',
            birthName: client.spouseInformation.birthName || '',
            address: client.spouseInformation.address || '',
            telephone: client.spouseInformation.phone || '',
            email: client.spouseInformation.email || '',
            dateOfBirth: client.spouseInformation.dateOfBirth || '',
            placeOfBirth: client.spouseInformation.placeOfBirth || '',
            nationality: client.spouseInformation.nationality || '',
            maritalStatus: client.spouseInformation.maritalStatus || '',
            occupation: client.spouseInformation.occupation || '',
            occupationSince: client.spouseInformation.occupationSince || '',
          };
        }

        if (isMounted.current) {
          setClientDetails(clientData);
          setHasSpouse(!!client.spouseInformation);
        }
      } else {
        console.log("No client data available");
      }
    } catch (error) {
      console.error("Error fetching client:", error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClientDetails(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field when user makes changes
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  const handleSpouseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClientDetails(prev => ({
      ...prev,
      spouseDetails: {
        ...(prev.spouseDetails || {}),
        [name]: value
      } as PersonDetails
    }));
    
    // Clear validation error for this spouse field when user makes changes
    const spouseFieldKey = `spouse_${name}`;
    if (validationErrors[spouseFieldKey]) {
      setValidationErrors(prev => ({
        ...prev,
        [spouseFieldKey]: false
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors = validateClientDetails(clientDetails, hasSpouse);
    setValidationErrors(errors);
    return !hasValidationErrors(errors);
  };

  const handleSave = async () => {
    // Check if user is authenticated and partnerId is available
    if (!auth.currentUser || !partnerId) {
      alert("You must be logged in to save a client.");
      history.push('/login');
      return;
    }

    // Validate the form before saving
    if (!validateForm()) {
      // Scroll to the first error field
      const firstErrorField = document.querySelector('.form-input-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      setSaving(true);
      
      // Generate a new client ID for new clients - ensure it's a string
      let clientId = id;
      if (id === 'new' || !id) {
        clientId = `client-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      }
      
      console.log("Using client ID:", clientId);
      console.log("Using partner ID:", partnerId);
      
      // Convert our component's client format to Firestore format
      const client = {
        clientId: clientId, // Use the generated clientId
        partnerId: partnerId, // Use the stored partnerId
        personalInformation: {
          firstName: clientDetails.firstName,
          lastName: clientDetails.lastName,
          birthName: clientDetails.birthName,
          dateOfBirth: clientDetails.dateOfBirth,
          placeOfBirth: clientDetails.placeOfBirth,
          nationality: clientDetails.nationality,
          maritalStatus: clientDetails.maritalStatus,
          status: "Active" // Default status
        },
        contactInformation: {
          email: clientDetails.email,
          phone: clientDetails.telephone,
          address: clientDetails.address
        },
        professionalInformation: {
          occupation: clientDetails.occupation,
          occupationSince: clientDetails.occupationSince
        },
        createdAt: id === 'new' ? new Date().toISOString() : clientDetails.createdAt,
        updatedAt: new Date().toISOString()
      };

      // Add spouse information if hasSpouse is true
      if (hasSpouse && clientDetails.spouseDetails) {
        client.spouseInformation = {
          firstName: clientDetails.spouseDetails.firstName,
          lastName: clientDetails.spouseDetails.lastName,
          birthName: clientDetails.spouseDetails.birthName,
          dateOfBirth: clientDetails.spouseDetails.dateOfBirth,
          placeOfBirth: clientDetails.spouseDetails.placeOfBirth,
          nationality: clientDetails.spouseDetails.nationality,
          maritalStatus: clientDetails.spouseDetails.maritalStatus,
          occupation: clientDetails.spouseDetails.occupation,
          occupationSince: clientDetails.spouseDetails.occupationSince,
          email: clientDetails.spouseDetails.email,
          phone: clientDetails.spouseDetails.telephone,
          address: clientDetails.spouseDetails.address
        };
      }
      
      // Convert any undefined values to null to avoid Firestore errors
      const cleanedClient = JSON.parse(JSON.stringify(client));
      
      console.log("Saving client:", cleanedClient);

      // Try using the ClientService instead of direct Firestore access
      const clientService = new ClientService();
      
      if (id === 'new' || !id) {
        // For new clients
        await clientService.createClient(cleanedClient);
      } else {
        // For existing clients
        await clientService.updateClient(clientId, cleanedClient);
      }
      
      console.log("Client saved successfully");
      
      if (isMounted.current) {
        history.push('/partner-dashboard');
      }
    } catch (error) {
      console.error("Error saving client:", error);
      if (isMounted.current) {
        alert(`Failed to save client: ${error.message}. Please check your connection and permissions.`);
      }
    } finally {
      if (isMounted.current) {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return <div className="form-container">Loading...</div>;
  }

  // Helper function to determine if a field has an error
  const hasError = (fieldName: string): boolean => {
    return !!validationErrors[fieldName];
  };

  // Helper function to get input class based on validation state
  const getInputClass = (fieldName: string): string => {
    return `form-input ${hasError(fieldName) ? 'form-input-error' : ''}`;
  };

  // Helper function to get spouse input class based on validation state
  const getSpouseInputClass = (fieldName: string): string => {
    return `form-input ${hasError(`spouse_${fieldName}`) ? 'form-input-error' : ''}`;
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <button 
          onClick={() => history.goBack()} 
          className="form-back-button"
        >
          <ArrowLeft size={16} />
          <span style={{ marginLeft: '5px' }}>Back</span>
        </button>
        <div>
          <h2 className="form-title">
            {id && id !== 'new' ? 'Edit Client' : 'New Client'}
          </h2>
        </div>
      </div>

      <form>
        <div className="form-grid">
          <div className="form-field">
            <label className="form-label">
              <span className="form-label-text">Vorname</span>
              <span className="form-label-subtext">First Name</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={clientDetails.firstName}
              onChange={handleInputChange}
              className={getInputClass('firstName')}
            />
            {hasError('firstName') && (
              <p className="form-error-message">First name is required</p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="form-label-text">Nachname</span>
              <span className="form-label-subtext">Last Name</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={clientDetails.lastName}
              onChange={handleInputChange}
              className={getInputClass('lastName')}
            />
            {hasError('lastName') && (
              <p className="form-error-message">Last name is required</p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="form-label-text">Geburtsname (falls vorhanden)</span>
              <span className="form-label-subtext">Birth Name (if any)</span>
            </label>
            <input
              type="text"
              name="birthName"
              value={clientDetails.birthName}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="form-label-text">Adresse</span>
              <span className="form-label-subtext">Address</span>
            </label>
            <input
              type="text"
              name="address"
              value={clientDetails.address}
              onChange={handleInputChange}
              className={getInputClass('address')}
            />
            {hasError('address') && (
              <p className="form-error-message">Address is required</p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="form-label-text">Telefonnummer</span>
              <span className="form-label-subtext">Telephone number</span>
            </label>
            <input
              type="text"
              name="telephone"
              value={clientDetails.telephone}
              onChange={handleInputChange}
              className={getInputClass('telephone')}
            />
            {hasError('telephone') && (
              <p className="form-error-message">Valid telephone number is required</p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="form-label-text">E-Mail-Adresse</span>
              <span className="form-label-subtext">E-Mail ID</span>
            </label>
            <input
              type="email"
              name="email"
              value={clientDetails.email}
              onChange={handleInputChange}
              className={getInputClass('email')}
            />
            {hasError('email') && (
              <p className="form-error-message">Valid email address is required</p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="form-label-text">Geburtsdatum</span>
              <span className="form-label-subtext">Date of birth</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={clientDetails.dateOfBirth}
              onChange={handleInputChange}
              className={getInputClass('dateOfBirth')}
            />
            {hasError('dateOfBirth') && (
              <p className="form-error-message">Valid date of birth is required</p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="form-label-text">Geburtsort</span>
              <span className="form-label-subtext">Place of birth</span>
            </label>
            <input
              type="text"
              name="placeOfBirth"
              value={clientDetails.placeOfBirth}
              onChange={handleInputChange}
              className={getInputClass('placeOfBirth')}
            />
            {hasError('placeOfBirth') && (
              <p className="form-error-message">Place of birth is required</p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="form-label-text">Staatsangehörigkeit</span>
              <span className="form-label-subtext">Nationality</span>
            </label>
            <select
              name="nationality"
              value={clientDetails.nationality}
              onChange={handleInputChange}
              className={`form-select ${hasError('nationality') ? 'form-input-error' : ''}`}
            >
              <option value="">Select nationality</option>
              {Object.entries(languageData.de.nationality_options).map(([key, value]) => (
                <option key={key} value={key}>
                  {value} ({languageData.en.nationality_options[key]})
                </option>
              ))}
            </select>
            {hasError('nationality') && (
              <p className="form-error-message">Nationality is required</p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="form-label-text">Familienstand</span>
              <span className="form-label-subtext">Marital status</span>
            </label>
            <select
              name="maritalStatus"
              value={clientDetails.maritalStatus}
              onChange={handleInputChange}
              className={`form-select ${hasError('maritalStatus') ? 'form-input-error' : ''}`}
            >
              <option value="">Select marital status</option>
              {Object.entries(languageData.de.marital_status_options).map(([key, value]) => (
                <option key={key} value={key}>
                  {value} ({languageData.en.marital_status_options[key]})
                </option>
              ))}
            </select>
            {hasError('maritalStatus') && (
              <p className="form-error-message">Marital status is required</p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="form-label-text">Beruf</span>
              <span className="form-label-subtext">Occupation</span>
            </label>
            <input
              type="text"
              name="occupation"
              value={clientDetails.occupation}
              onChange={handleInputChange}
              className={getInputClass('occupation')}
            />
            {hasError('occupation') && (
              <p className="form-error-message">Occupation is required</p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label">
              <span className="form-label-text">Beruf seit</span>
              <span className="form-label-subtext">Occupation since</span>
            </label>
            <input
              type="date"
              name="occupationSince"
              value={clientDetails.occupationSince}
              onChange={handleInputChange}
              className={getInputClass('occupationSince')}
            />
            {hasError('occupationSince') && (
              <p className="form-error-message">Valid date is required</p>
            )}
          </div>
        </div>

        <div className="form-checkbox-container">
          <input
            type="checkbox"
            id="hasSpouse"
            checked={hasSpouse}
            onChange={(e) => setHasSpouse(e.target.checked)}
            className="form-checkbox"
          />
          <label htmlFor="hasSpouse" className="form-label">
            <span className="form-label-text">Ehepartner/Partner hinzufügen</span>
            <span className="form-label-subtext">Add spouse/partner</span>
          </label>
        </div>

        {hasSpouse && (
          <div className="spouse-section">
            <h3 className="spouse-title">
              Ehepartner/Partner Details (Spouse/Partner Details)
            </h3>
            
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">
                  <span className="form-label-text">Vorname</span>
                  <span className="form-label-subtext">First Name</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={clientDetails.spouseDetails?.firstName || ''}
                  onChange={handleSpouseInputChange}
                  className={getSpouseInputClass('firstName')}
                />
                {hasError('spouse_firstName') && (
                  <p className="form-error-message">Spouse first name is required</p>
                )}
              </div>
              
              <div className="form-field">
                <label className="form-label">
                  <span className="form-label-text">Nachname</span>
                  <span className="form-label-subtext">Last Name</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={clientDetails.spouseDetails?.lastName || ''}
                  onChange={handleSpouseInputChange}
                  className={getSpouseInputClass('lastName')}
                />
                {hasError('spouse_lastName') && (
                  <p className="form-error-message">Spouse last name is required</p>
                )}
              </div>
              
              <div className="form-field">
                <label className="form-label">
                  <span className="form-label-text">Geburtsname (falls vorhanden)</span>
                  <span className="form-label-subtext">Birth Name (if any)</span>
                </label>
                <input
                  type="text"
                  name="birthName"
                  value={clientDetails.spouseDetails?.birthName || ''}
                  onChange={handleSpouseInputChange}
                  className="form-input"
                />
              </div>
              
              <div className="form-field">
                <label className="form-label">
                  <span className="form-label-text">Adresse</span>
                  <span className="form-label-subtext">Address</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={clientDetails.spouseDetails?.address || ''}
                  onChange={handleSpouseInputChange}
                  className={getSpouseInputClass('address')}
                />
                {hasError('spouse_address') && (
                  <p className="form-error-message">Spouse address is required</p>
                )}
              </div>
              
              <div className="form-field">
                <label className="form-label">
                  <span className="form-label-text">Telefonnummer</span>
                  <span className="form-label-subtext">Telephone number</span>
                </label>
                <input
                  type="text"
                  name="telephone"
                  value={clientDetails.spouseDetails?.telephone || ''}
                  onChange={handleSpouseInputChange}
                  className={getSpouseInputClass('telephone')}
                />
                {hasError('spouse_telephone') && (
                  <p className="form-error-message">Valid spouse telephone number is required</p>
                )}
              </div>
              
              <div className="form-field">
                <label className="form-label">
                  <span className="form-label-text">E-Mail-Adresse</span>
                  <span className="form-label-subtext">E-Mail ID</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={clientDetails.spouseDetails?.email || ''}
                  onChange={handleSpouseInputChange}
                  className={getSpouseInputClass('email')}
                />
                {hasError('spouse_email') && (
                  <p className="form-error-message">Valid spouse email is required</p>
                )}
              </div>
              
              <div className="form-field">
                <label className="form-label">
                  <span className="form-label-text">Geburtsdatum</span>
                  <span className="form-label-subtext">Date of birth</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={clientDetails.spouseDetails?.dateOfBirth || ''}
                  onChange={handleSpouseInputChange}
                  className={getSpouseInputClass('dateOfBirth')}
                />
                {hasError('spouse_dateOfBirth') && (
                  <p className="form-error-message">Valid spouse date of birth is required</p>
                )}
              </div>
              
              <div className="form-field">
                <label className="form-label">
                  <span className="form-label-text">Geburtsort</span>
                  <span className="form-label-subtext">Place of birth</span>
                </label>
                <input
                  type="text"
                  name="placeOfBirth"
                  value={clientDetails.spouseDetails?.placeOfBirth || ''}
                  onChange={handleSpouseInputChange}
                  className={getSpouseInputClass('placeOfBirth')}
                />
                {hasError('spouse_placeOfBirth') && (
                  <p className="form-error-message">Spouse place of birth is required</p>
                )}
              </div>
              
              <div className="form-field">
                <label className="form-label">
                  <span className="form-label-text">Staatsangehörigkeit</span>
                  <span className="form-label-subtext">Nationality</span>
                </label>
                <select
                  name="nationality"
                  value={clientDetails.spouseDetails?.nationality || ''}
                  onChange={handleSpouseInputChange}
                  className={`form-select ${hasError('spouse_nationality') ? 'form-input-error' : ''}`}
                >
                  <option value="">Select nationality</option>
                  {Object.entries(languageData.de.nationality_options).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value} ({languageData.en.nationality_options[key]})
                    </option>
                  ))}
                </select>
                {hasError('spouse_nationality') && (
                  <p className="form-error-message">Spouse nationality is required</p>
                )}
              </div>
              
              <div className="form-field">
                <label className="form-label">
                  <span className="form-label-text">Familienstand</span>
                  <span className="form-label-subtext">Marital status</span>
                </label>
                <select
                  name="maritalStatus"
                  value={clientDetails.spouseDetails?.maritalStatus || ''}
                  onChange={handleSpouseInputChange}
                  className={`form-select ${hasError('spouse_maritalStatus') ? 'form-input-error' : ''}`}
                >
                  <option value="">Select marital status</option>
                  {Object.entries(languageData.de.marital_status_options).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value} ({languageData.en.marital_status_options[key]})
                    </option>
                  ))}
                </select>
                {hasError('spouse_maritalStatus') && (
                  <p className="form-error-message">Spouse marital status is required</p>
                )}
              </div>
              
              <div className="form-field">
                <label className="form-label">
                  <span className="form-label-text">Beruf</span>
                  <span className="form-label-subtext">Occupation</span>
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={clientDetails.spouseDetails?.occupation || ''}
                  onChange={handleSpouseInputChange}
                  className={getSpouseInputClass('occupation')}
                />
                {hasError('spouse_occupation') && (
                  <p className="form-error-message">Spouse occupation is required</p>
                )}
              </div>
              
              <div className="form-field">
                <label className="form-label">
                  <span className="form-label-text">Beruf seit</span>
                  <span className="form-label-subtext">Occupation since</span>
                </label>
                <input
                  type="date"
                  name="occupationSince"
                  value={clientDetails.spouseDetails?.occupationSince || ''}
                  onChange={handleSpouseInputChange}
                  className={getSpouseInputClass('occupationSince')}
                />
                {hasError('spouse_occupationSince') && (
                  <p className="form-error-message">Valid spouse occupation date is required</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => history.goBack()}
            className="btn btn-cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? (
              <>Saving...</>
            ) : (
              <>
                <Save size={16} style={{ marginRight: '0.5rem' }} />
                Save Client
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 