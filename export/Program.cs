namespace export;

class Program
{
    static void Main(string[] args)
    {
        if (args.Length == 0)
        {
            Console.WriteLine("Usage: export <path to nesql export directory> [<output path>]");
            return;
        }

        string path = args[0];
        string outputPath = args.Length > 1 ? args[1] : args[0];

        Console.WriteLine($"Exporting nesql data from {path}...");
    }
}