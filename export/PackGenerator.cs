using System.Text;
using Source.Data;

namespace Source
{
    
    public class PackGenerator
    {
        private const string hardcodedPath = @"C:\Users\ShadowTheAge\AppData\Roaming\PrismLauncher\instances\GT New Horizons 2.7.4\.minecraft\nesql\nesql-repository";

        private static void GenerateDefault(bool skipIcons)
        {
            var generator = new PackGenerator();
            generator.Generate(hardcodedPath, skipIcons);
        }
        
        private Repository Generate(string sourcePath, bool skipIcons = false)
        {
            var dbParser = new DatabaseParser();
            dbParser.Parse(Path.Combine(sourcePath, "nesql-db.script"));

            var iconList = new List<string>();
            var repository = PackConverter.Convert(dbParser, iconList);
            
            PackPreProcessor.PreProcessPack(repository);
            HardcodeFixes.Fix(repository);
            
            var mmap = new MemoryMappedPackConverter(repository);
            var compiledBytes = mmap.Compile();
            File.WriteAllBytes("C:\\projects\\GtnhCalc\\data\\data.bin", compiledBytes);
            
            if (!skipIcons)
            {
                using var builder = new AtlasBuilder(Path.Combine(sourcePath, "image.zip"), Path.GetDirectoryName(IconsPath));
                var pagesPath = builder.BuildAtlases(iconList);

                var atlasPages = new Texture2D[pagesPath.Count];
                for (var index = 0; index < pagesPath.Count; index++)
                {
                    var path = pagesPath[index];
                    AssetDatabase.ImportAsset(path, ImportAssetOptions.ForceSynchronousImport);
                    atlasPages[index] = AssetDatabase.LoadAssetAtPath<Texture2D>(path);
                }

                var iconsAsset = PackConverter.GetScriptableObjectAtPath<IconAtlas>(IconsPath);
                iconsAsset.pages = atlasPages;
            }
            
            return repository;
        }
    }
}