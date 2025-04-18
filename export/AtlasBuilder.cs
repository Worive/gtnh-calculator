using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using Source.Data;
using UnityEngine;
using Object = UnityEngine.Object;

namespace Source
{
    public class AtlasBuilder : IDisposable
    {
        private Texture2D currentAtlas;
        private readonly Texture2D singleTexture = new Texture2D(64, 64, TextureFormat.RGBA32, false);

        private readonly ZipArchive archive;
        private readonly string savePath;
        
        public AtlasBuilder(string imagesArchivePath, string savePath)
        {
            archive = new ZipArchive(File.OpenRead(imagesArchivePath), ZipArchiveMode.Read);
            this.savePath = savePath;
        }

        private Texture2D GetPngTexture(string path)
        {
            var entry = archive.GetEntry(path);
            if (entry == null)
            {
                path = path.Substring(0, path.Length - 4);
                foreach (var iEntry in archive.Entries)
                {
                    if (iEntry.FullName.StartsWith(path, StringComparison.Ordinal))
                    {
                        entry = iEntry;
                        break;
                    }
                }
            }

            if (entry == null)
            {
                Debug.LogError("Unable to find archive entry for " + path);
                return null;
            }

            using var reader = entry.Open();
            using var ms = new MemoryStream((int)entry.Length);
            reader.CopyTo(ms);
            singleTexture.LoadImage(ms.GetBuffer());
            return singleTexture;
        }
        
        public List<string> BuildAtlases(List<string> iconsPaths)
        {
            var count = iconsPaths.Count;
            var atlases = ((count - 1) / IconAtlas.SpritesPerPage) + 1;
            var pagesPath = new List<string>();
            for (var atlasId = 0; atlasId < atlases; atlasId++)
            {
                var min = atlasId * IconAtlas.SpritesPerPage;
                var max = Mathf.Min(min + IconAtlas.SpritesPerPage, iconsPaths.Count);
                var iconsInThisAtlas = max - min;
                var requiredHeight = (iconsInThisAtlas - 1) / (1 << IconAtlas.DimensionBits) + 1;
                currentAtlas = new Texture2D(IconAtlas.TextureSize, requiredHeight * IconAtlas.ImageSize, TextureFormat.RGBA32, false);
                for (var iconId = min; iconId < max; iconId++)
                {
                    var path = iconsPaths[iconId];
                    if (path == null)
                        continue;
                    var texture = GetPngTexture(path);
                    if (texture == null)
                        continue;
                    
                    var positionX = (iconId & IconAtlas.XMask) * IconAtlas.ImageSize;
                    var positionY = ((requiredHeight - 1) - ((iconId & IconAtlas.YMask) >> IconAtlas.DimensionBits)) * IconAtlas.ImageSize;
                    currentAtlas.CopyPixels(texture, 0, 0, 0, 0, IconAtlas.ImageSize, IconAtlas.ImageSize, 0, positionX, positionY);
                }
                
                currentAtlas.Apply();
                var png = currentAtlas.EncodeToPNG();
                var atlasPath = Path.Combine(savePath, atlasId + ".png");
                pagesPath.Add(atlasPath);
                File.WriteAllBytes(atlasPath, png);
                Object.DestroyImmediate(currentAtlas);
                currentAtlas = null;
            }

            return pagesPath;
        }

        public void Dispose()
        {
            archive.Dispose();
        }
    }
}