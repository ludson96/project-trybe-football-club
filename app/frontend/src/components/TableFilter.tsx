import React from 'react';
import '../styles/pages/games.css';

interface TableFilterProps {
  currentFilter: string;
  setCurrentFilter: (filter: string) => void;
}

const TableFilter: React.FC<TableFilterProps> = ({ currentFilter, setCurrentFilter }) => {
  const handleCurrentFilter = () => {
    const selectElement = document.getElementById('classification-filter') as HTMLSelectElement | null;
    if (selectElement) {
      setCurrentFilter(selectElement.value);
    }
  };

  return (
    <form>
      <label htmlFor="classification-filter">
        Partidas:
        <select
          id="classification-filter"
          defaultValue={ currentFilter }
          data-testid="score_boarding__classification_filter"
        >
          <option>Classificação Geral</option>
          <option>Classificação Mandantes</option>
          <option>Classificação Visitantes</option>
        </select>
      </label>
      <button
        data-testid="score_boarding__classification_filter_button"
        type="button"
        onClick={ () => handleCurrentFilter() }
      >
        Buscar
      </button>
    </form>
  );
};

export default TableFilter;
