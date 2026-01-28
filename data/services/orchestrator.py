from .cleaning.data_cleaner import DataCleaner
from .processing.analysis_engine import AnalysisEngine

class DataOrchestrator:
    """
    Le Chef d'Orchestre (Orchestrator).
    Il unifie les services de nettoyage et d'analyse.
    Structure inspirée par le Mind Pipeline de Tayierjiang Tayier.
    """
    def __init__(self, data_source_dir=None):
        # 1. Initialisation du nettoyeur
        self.cleaner = DataCleaner(data_source_dir)
        
        # 2. Chargement des données (Utilise le code original de Tayier)
        df_renovation = self.cleaner.load_renovation()
        df_dpe = self.cleaner.load_dpe()
        df_dpe_types = self.cleaner.load_dpe_types()
        
        # 3. Initialisation du moteur d'analyse
        self.engine = AnalysisEngine(df_renovation, df_dpe, df_dpe_types)

    def get_batiment_stats(self):
        return self.engine.get_data_Batiment_renovates()

    def get_energy_stats(self):
        return self.engine.get_data_energy_classes(self.cleaner)

    def get_type_stats(self):
        return self.engine.get_data_Renovation_types()

# Alias pour compatibilité si nécessaire
class analyse_data_renovationParis(DataOrchestrator):
    """Alias pour maintenir la compatibilité avec l'ancien code."""
    def get_data_Batiment_renovates(self): return self.get_batiment_stats()
    def get_data_energy_classes(self): return self.get_energy_stats()
    def get_data_Renovation_types(self): return self.get_type_stats()
