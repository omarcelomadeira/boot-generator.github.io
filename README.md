# Static Boot Image Generator

This is a simple tool to generate a static boot image for use in Android Car Multimedia.

## How to use

Simply clone this repository and use the command:

```
npx http-server
```

Then open the browser at http://localhost:8080

## License

MIT

## How to use the image result

- Create a folder named __boot_logo__.
- Place the image generated by this site inside the folder.
- Copy the folder containing the logo file to a clean USB drive (FAT32 formatted).
- Insert the USB drive into the Android radio unit.
- Access the Engineering Menu (code maybe: 16176699).
- Locate the __Logo Settings__ option.
- In the right window, click on __Logo Settings__.
- Select your logo file.
- Click __Logo Settings__ at the bottom.
- Press __Save__ (top-right corner). The radio will restart.
- Done.
