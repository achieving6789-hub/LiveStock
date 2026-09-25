import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useLanguage } from '../../contexts/LanguageContext';
import { PlusCircle, Search, Filter, ChevronRight, X } from 'lucide-react';

const QUICK_BREEDS = [
  { en: 'Kangayam', ta: 'காங்கேயம்' },
  { en: 'Umblachery', ta: 'உம்பளச்சேரி' },
  { en: 'Alambadi', ta: 'ஆலம்பாடி' },
  { en: 'Murrah', ta: 'முர்ரா' },
  { en: 'Country Breed', ta: 'நாட்டு இனம்' },
];

export const MyAnimalsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [animals, setAnimals] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newSpecies, setNewSpecies] = useState('Cattle');
  const [newBreed, setNewBreed] = useState('');
  const [newAge, setNewAge] = useState('24');
  const [newGender, setNewGender] = useState<'MALE' | 'FEMALE'>('FEMALE');
  const [creating, setCreating] = useState(false);

  const fetchAnimals = () => {
    api.get('/animals')
      .then((res) => setAnimals(res.data.data.animals || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const handleRegisterAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      await api.post('/animals', {
        tagNumber: newTag,
        species: newSpecies,
        breed: newBreed || undefined,
        ageMonths: parseInt(newAge) || 12,
        gender: newGender,
        villageId: 'vil-kallanur-01',
      });
      setIsModalOpen(false);
      setNewTag('');
      setNewBreed('');
      fetchAnimals();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to register animal');
    } finally {
      setCreating(false);
    }
  };

  const filteredAnimals = animals.filter((a) => {
    const matchesSearch =
      a.tagNumber.toLowerCase().includes(search.toLowerCase()) ||
      (a.breed && a.breed.toLowerCase().includes(search.toLowerCase()));
    const matchesSpecies = selectedSpecies === 'ALL' || a.species === selectedSpecies;
    return matchesSearch && matchesSpecies;
  });

  const isTa = language === 'ta';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{t('animalsRegistry.title')}</h1>
          <p className="text-xs text-slate-500">
            {t('animalsRegistry.subTitle')}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('animalsRegistry.registerBtn')}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={t('animalsRegistry.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium"
          >
            <option value="ALL">{t('animalsRegistry.allSpecies')}</option>
            <option value="Cattle">{t('species.Cattle')}</option>
            <option value="Buffalo">{t('species.Buffalo')}</option>
            <option value="Goat">{t('species.Goat')}</option>
            <option value="Sheep">{t('species.Sheep')}</option>
            <option value="Poultry">{t('species.Poultry')}</option>
          </select>
        </div>
      </div>

      {/* Animals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAnimals.map((animal) => {
          const speciesName = t(`species.${animal.species}`) || animal.species;
          const genderText = animal.gender === 'FEMALE' ? t('animalsRegistry.female') : t('animalsRegistry.male');

          return (
            <div
              key={animal.id}
              className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:border-emerald-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    #{animal.tagNumber}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {t('animalsRegistry.healthy')}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900">
                  {animal.breed || speciesName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {speciesName} &bull; {genderText} &bull; {animal.ageMonths} {isTa ? 'மாதங்கள்' : 'months'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">{isTa ? 'கிராமம்: கல்லாநூர்' : 'Village: Kallanur'}</span>
                <Link
                  to={`/farmer/animals/${animal.id}`}
                  className="text-emerald-700 font-semibold hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>{t('animalsRegistry.viewTimeline')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Register Animal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">{t('animalsRegistry.registerModalTitle')}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterAnimal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('animalsRegistry.tagNumber')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('animalsRegistry.tagPlaceholder')}
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('animalsRegistry.species')}</label>
                  <select
                    value={newSpecies}
                    onChange={(e) => setNewSpecies(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Cattle">{t('species.Cattle')}</option>
                    <option value="Buffalo">{t('species.Buffalo')}</option>
                    <option value="Goat">{t('species.Goat')}</option>
                    <option value="Sheep">{t('species.Sheep')}</option>
                    <option value="Poultry">{t('species.Poultry')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('animalsRegistry.breed')}</label>
                  <input
                    type="text"
                    placeholder={t('animalsRegistry.breedPlaceholder')}
                    value={newBreed}
                    onChange={(e) => setNewBreed(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {/* Quick Breed suggestions */}
              <div className="flex flex-wrap gap-1">
                {QUICK_BREEDS.map((qb) => {
                  const label = isTa ? qb.ta : qb.en;
                  return (
                    <button
                      key={qb.en}
                      type="button"
                      onClick={() => setNewBreed(label)}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('animalsRegistry.age')}</label>
                  <input
                    type="number"
                    min="1"
                    value={newAge}
                    onChange={(e) => setNewAge(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('animalsRegistry.gender')}</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as any)}
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="FEMALE">{t('animalsRegistry.female')}</option>
                    <option value="MALE">{t('animalsRegistry.male')}</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
                >
                  {creating ? t('common.loading') : t('animalsRegistry.saveBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
