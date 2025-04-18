using Source.Data;

namespace Source
{
    public static class HardcodeFixes
    {
        public static void Fix(Repository repository)
        {
            Console.WriteLine("Applying hardcode fixes...");
            var canner = repository.recipeTypes.First(x => x.name == "Canner");
            canner.fluidInputs = canner.fluidOutputs = new RecipeDimensions(1, 1);
            var bbf = repository.recipeTypes.First(x => x.name == "Primitive Blast Furnace");
            var bbfItem = repository.items.First(x => x.name == "Bricked Blast Furnace");
            bbf.defaultCrafter = bbfItem;
            bbf.multiblocks.Add(bbfItem);
            var eoh = repository.recipeTypes.First(x => x.name == "Eye of Harmony");
            eoh.fluidInputs = new RecipeDimensions(1, 3);
        }
    }
}