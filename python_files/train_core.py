import numpy as np
import joblib
from rdkit import Chem
from rdkit.Chem import Descriptors
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# 1. Feature Extraction Function
def get_molecular_properties(smiles: str):
    """Converts a SMILES string into a flat numerical array of chemical traits."""
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        # Return zeros if a SMILES string is corrupted or unparseable
        return [0.0, 0.0, 0.0]
    
    weight = Descriptors.MolWt(mol)
    log_p = Descriptors.MolLogP(mol)
    h_donors = Descriptors.NumHDonors(mol)
    
    return [weight, log_p, float(h_donors)]

print("📦 Step 1: Gathering and parsing chemical dataset...")

# 2. Curated Sample Data (SMILES Strings)
# In production, this would be an iterative loop over your raw text dataset lines
sample_smiles = [
    "CC(=O)OC1=CC=CC=C1C(=O)O",       # Aspirin (Binds)
    "CN1C=NC2=C1C(=O)N(C(=O)N2C)C",   # Caffeine (Binds)
    "CC1=CC=C(C=C1)C(C)C2=CC=C(C=C2)O", # Experimental drug blocker (Binds)
    "CCO",                            # Ethanol/Simple Alcohol (Doesn't Bind)
    "C",                              # Methane/Single Carbon Gas (Doesn't Bind)
    "CC(=O)O",                        # Acetic Acid/Vinegar (Doesn't Bind)
    "C1=CC=C(C=C1)O",                 # Phenol (Doesn't Bind)
    "CCN(CC)C(=O)C1CN(C2CC1=CNC3=CC=CC=C23)C" # Complex structural ligand (Binds)
]

# 3. Target Labels (1 = Successfully Binds, 0 = Fails to Bind)
labels = [1, 1, 1, 0, 0, 0, 0, 1]

# 4. Process the raw strings into a clean numerical matrix (X)
X = np.array([get_molecular_properties(s) for s in sample_smiles])
y = np.array(labels)

# 5. Split data into Training and Testing sets to evaluate performance accurately
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

print(f"🔬 Training on {len(X_train)} samples, testing on {len(X_test)} samples.")
print("🏋️‍♂️ Step 2: Training the Random Forest Classifier...")

# 6. Initialize and fit the Scikit-Learn Model
# Random Forest uses an ensemble of decision trees to make stable classifications
model = RandomForestClassifier(n_estimators=50, max_depth=5, random_state=42)
model.fit(X_train, y_train)

# 7. Evaluate the model to verify it actually learned something
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"📊 Model Test Accuracy: {round(accuracy * 100, 2)}%")

# 8. Freeze the weights and save the model artifact to disk
output_filename = "docking_model.pkl"
joblib.dump(model, output_filename)
print(f"💾 Step 3: Success! Model saved as '{output_filename}'")