using Source;

namespace export;

class Program
{
    static void Main(string[] args)
    {
        if (args.Length == 0)
        {
            Console.WriteLine("Usage: export <path to nesql export directory> [--output <path>] [--skipIcons]");
            Console.WriteLine("  --output <path>    Specify the output path for the generated files (default: current directory)");
            Console.WriteLine("  --skipIcons        Skip the icon generation step (you can't change item ban list or similar, or the icon index will be wrong)");
            return;
        }

        var path = args[0];
        var outputPath = ".";
        var skipIcons = false;

        for (int i = 1; i < args.Length; i++)
        {
            if (args[i] == "--output" && i + 1 < args.Length)
            {
                outputPath = args[i + 1];
                i++; // Skip the next argument since we've used it
            }
            else if (args[i] == "--skipIcons")
            {
                skipIcons = true;
            }
        }

        PackGenerator.Generate(path, outputPath, skipIcons);
    }
}