import React, { useState, useRef } from 'react';
import {
  User,
  Building,
  Phone,
  Mail,
  Languages,
  Download,
  Upload,
  Trash2,
  ShieldCheck,
  Edit2,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useLabor } from '../context/LaborContext';
import { t } from '../utils/strings';

export const SettingsScreen: React.FC = () => {
  const {
    userProfile,
    updateProfile,
    exportBackup,
    importBackup,
    clearAllData,
    workers,
    transactions,
    showToast
  } = useLabor();

  const lang = userProfile.language || 'en';
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Edit dialog state
  const [editingField, setEditingField] = useState<'business' | 'mobile' | 'name' | null>(null);
  const [fieldValue, setFieldValue] = useState('');
  const [showClearModal, setShowClearModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleSaveField = () => {
    if (editingField === 'business') {
      updateProfile({ businessName: fieldValue.trim() || 'LabourBook Construction' });
    } else if (editingField === 'mobile') {
      updateProfile({ mobile: fieldValue.trim() });
    } else if (editingField === 'name') {
      updateProfile({ name: fieldValue.trim() });
    }
    setEditingField(null);
    setFieldValue('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importBackup(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="pb-24 pt-2 px-3 max-w-4xl mx-auto space-y-4">
      {/* 1. Profile Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4">
        <div className="flex items-center gap-3 pb-3.5 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-blue-500/20">
            {userProfile.name.charAt(0) || 'U'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">{userProfile.name}</h3>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded-full">
                Active Pro
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{userProfile.businessName}</p>
            <span className="text-[11px] text-slate-400">{userProfile.email}</span>
          </div>
        </div>

        {/* Profile Info Items */}
        <div className="divide-y divide-slate-100 mt-2">
          {/* Business Name */}
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Building className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  {t('business_name', lang)}
                </span>
                <span className="text-xs font-bold text-slate-800">{userProfile.businessName}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingField('business');
                setFieldValue(userProfile.businessName);
              }}
              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {/* Registered Mobile */}
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                  {t('user_mobile', lang)}
                </span>
                <span className="text-xs font-bold text-slate-800">{userProfile.mobile}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingField('mobile');
                setFieldValue(userProfile.mobile);
              }}
              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Language Selection */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4">
        <div className="flex items-center gap-2 mb-3">
          <Languages className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm">{t('language', lang)}</h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => updateProfile({ language: 'en' })}
            className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
              lang === 'en'
                ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {lang === 'en' && <CheckCircle className="w-4 h-4" />}
            English
          </button>
          <button
            onClick={() => updateProfile({ language: 'hi' })}
            className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
              lang === 'hi'
                ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {lang === 'hi' && <CheckCircle className="w-4 h-4" />}
            हिंदी (Hindi)
          </button>
        </div>
      </div>

      {/* 3. Master Backup & Restore */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-3">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-purple-600" />
          <h3 className="font-bold text-slate-900 text-sm">Data Backup & Migration</h3>
        </div>

        <p className="text-xs text-slate-500">
          Save your complete database ({workers.length} staff, {transactions.length} cash entries) to a lightweight CSV file or restore from a backup.
        </p>

        <div className="grid sm:grid-cols-2 gap-2 pt-1">
          <button
            onClick={exportBackup}
            className="py-2.5 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>{t('download_csv', lang)}</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Upload className="w-4 h-4" />
            <span>{t('restore_csv', lang)}</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,text/csv"
            className="hidden"
          />
        </div>
      </div>

      {/* 4. Privacy Policy & App Info */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div>
            <h4 className="font-bold text-slate-900 text-xs">Privacy & Data Security</h4>
            <p className="text-[11px] text-slate-500">All data stored safely on your device</p>
          </div>
        </div>
        <button
          onClick={() => setShowPrivacyModal(true)}
          className="text-xs font-bold text-blue-600 hover:underline"
        >
          View Policy
        </button>
      </div>

      {/* 5. Danger Zone: Reset Data */}
      <div className="bg-red-50/60 rounded-2xl border border-red-200/80 p-4 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-red-900 text-xs">Reset All Data</h4>
          <p className="text-[11px] text-red-600">Clear all workers, logs and cash entries</p>
        </div>
        <button
          onClick={() => setShowClearModal(true)}
          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-2xs transition"
        >
          {t('clear_data', lang)}
        </button>
      </div>

      {/* Edit Field Modal */}
      {editingField !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Edit {editingField === 'business' ? 'Business Name' : editingField === 'mobile' ? 'Mobile Number' : 'Name'}
            </h3>

            <input
              type="text"
              autoFocus
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setEditingField(null)}
                className="flex-1 py-2 bg-slate-100 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveField}
                className="flex-1 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Data Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Reset All App Data?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This will permanently delete all worker profiles, attendance logs, overtime, and cash book entries. Make sure you have exported a CSV backup first.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAllData();
                  setShowClearModal(false);
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl space-y-3 max-h-[80vh] overflow-y-auto">
            <h3 className="font-bold text-slate-900 text-base">Privacy Policy & Architecture</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Laborbook operates locally with high privacy standards. All worker records, daily attendance logs, and financial transactions remain secure inside your browser's persistent storage. You can export complete, portable CSV master backups at any time.
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5 list-disc pl-4">
              <li>No unrequested third-party tracking.</li>
              <li>Instant, offline-capable calculations.</li>
              <li>Portable CSV format compatible with spreadsheet tools.</li>
            </ul>
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl mt-3"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
