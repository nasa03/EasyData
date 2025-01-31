import { DataType } from '../types/data_type';
import { utils } from '../utils/utils';

/**
 * Contains internatialization functionality.
 */
export namespace i18n {
    export interface LocaleSettings {
        shortDateFormat?: string;
        editDateFormat?: string;
        longDateFormat?: string;
        shortTimeFormat?: string;
        editTimeFormat?: string;
        longTimeFormat?: string;
        shortMonthNames?: string[];
        longMonthNames?: string[];
        shortWeekDayNames?: string[];
        longWeekDayNames?: string[];
        decimalSeparator?: string;
        currency?: string;
    }
    
    export interface TextResources {
        [propName: string]: string | TextResources;
    }
    
    
    export interface LocaleInfo {
        localeId?: string;
        englishName?: string;
        displayName?: string;
        texts?: TextResources;
        settings?: LocaleSettings; //if the settings is not specified - we will use the default.
    }
    
    export interface LocaleInfoItem {
        locale: string;
        englishName?: string;
        displayName?: string;
    }    

    let englishUSLocaleSettings: LocaleSettings = {
        shortDateFormat: 'MM/dd/yyyy',
        longDateFormat: 'dd MMM, yyyy',
        editDateFormat: 'MM/dd/yyyy',
        shortTimeFormat: 'HH:mm',
        editTimeFormat: 'HH:mm',
        longTimeFormat: 'HH:mm:ss',
        shortMonthNames: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
        longMonthNames: [ 'January', 'February', 'March', 'April', 'May', 'June', 
                            'July', 'August', 'September', 'October', 'November', 'December' ],
        shortWeekDayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        longWeekDayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        decimalSeparator:'.',
        currency: 'USD'
    }

    interface LocalesDict {
        [localeId: string]: LocaleInfo
    }

    let defaultLocale: LocaleInfo = {
        localeId: 'en-US',
        englishName: 'English',
        displayName: 'English',
        texts: {
            ButtonOK: 'OK',
            ButtonCancel: 'Cancel',
            Yes: 'Yes',
            No: 'No',
            True: 'True',
            False: 'False'
        },
        settings: englishUSLocaleSettings
    };

    let allLocales: LocalesDict = {
        'en-US': defaultLocale
    }

    let currentLocale : LocaleInfo;
    
    type LocaleMapper = (info: LocaleInfo) => void;

    const mappers: LocaleMapper[] = [];

    function mapInfo(info: LocaleInfo) {
        for(const mapper of mappers) {
            mapper(info);
        }
    }

    export function addMapper(mapper: LocaleMapper) {
        mappers.push(mapper);
    }

    /**
     * Gets added locales with their names.
     * @returns  The locales.
     */
    export function getLocales(): LocaleInfoItem[] {
        let result: LocaleInfoItem[] = [];

        for(let locale in allLocales) {
            result.push({
                locale: locale,
                englishName: allLocales[locale].englishName,
                displayName: allLocales[locale].displayName
            });
        }

        return result.sort((a, b) => {
            if (a.englishName > b.englishName) {
                return 1;
            }
            else if (a.englishName === b.englishName) {
                return 0;
            }

            return - 1;
        });
    }

    /**
     * Gets the current locale ID.
     * @returns The locale.
     */
    export function getCurrentLocale() : string {
        return currentLocale.localeId;
    }

    
     /**
     * Sets the curent locale. 
     * @deprecated Use setCurrentLocale instead
     * @param l The locale.
     */
    export function setLocale(l : string) : void {
        console.warn('This method is deprecated. Use setCurrentLocale instead');
        setCurrentLocale(l);
    }

    /**
     * Sets the curent locale.
     * @param localeId The locale.
     */
    export function setCurrentLocale(localeId : string) : void {
        const newLocale = allLocales[localeId];
        if (newLocale) {          
            utils.assignDeep(currentLocale, newLocale);
        }
        else {
            currentLocale.englishName = localeId;
            currentLocale.displayName = localeId;
            currentLocale.texts = utils.assignDeep({}, defaultLocale.texts);
        }
        currentLocale.localeId = localeId;
    }

    /**
     * Returns localized text by the key defined in parameter.
     * Here we get the text of the resource string assigned to CmdClickToAddCondition key:
     * 
     ```
       const text = i18n.getText('CmdClickToAddCondition')
     ```
     * @param args The keys of the resource string.
     * @returns Text of the resource defined by key or null if the key is not found
     * 
     */
    export function getText(...args: string[]): string {
        let textsObj: any = currentLocale.texts;

        let resText : string | TextResources = '';
        if (args && args.length) {
            const argLength = args.length;
            for (let i = 0; i < argLength; i++) {
                resText = textsObj[args[i]];
                if (typeof resText === 'object') {
                    textsObj = resText;
                }
                else {
                    break; 
                }
            }
        }

        return resText as string;
    }

    export function getLocaleSettings(): LocaleSettings {
        return currentLocale.settings;
    }

    export function getOneLocaleSetting(key: string): any {
        return currentLocale.settings[key]; 
    }

    export function getShortMonthName(monthNum: number) : string {
        const settings = getLocaleSettings();
        if (monthNum > 0 && monthNum < 13) {
            return settings.shortMonthNames[monthNum - 1];
        }
        else {
            throw 'Wrong month number: ' + monthNum;
        }
    }

    export function getLongMonthName(monthNum: number) : string {
        const settings = getLocaleSettings();
        if (monthNum > 0 && monthNum < 13) {
            return settings.longMonthNames[monthNum - 1];
        }
        else {
            throw 'Wrong month number: ' + monthNum;
        }
    }

    export function getShortWeekDayName(dayNum: number) : string {
        const settings = getLocaleSettings();
        if (dayNum > 0 && dayNum < 8) {
            return settings.shortWeekDayNames.length >= dayNum 
                ? settings.shortWeekDayNames[dayNum - 1] 
                : dayNum.toString();
        }
        else {
            throw 'Wrong month number: ' + dayNum;
        }
    }

    export function getLongWeekDayName(dayNum: number) : string {
        const settings = getLocaleSettings();
        if (dayNum > 0 && dayNum < 8) {
            return settings.longWeekDayNames.length >= dayNum 
                ? settings.longWeekDayNames[dayNum - 1] 
                : dayNum.toString();
        }
        else {
            throw 'Wrong month number: ' + dayNum;
        }
    }

    /**
     * Updates the locale settings (date/time formats, separators, etc) for the specified locale.
     * @param settingsToUpdate a LocaleSettings object
     */
    export function updateLocaleSettings(settingsToUpdate: LocaleSettings) : void {
        if (!currentLocale.settings) {
            currentLocale.settings = utils.assignDeep({}, englishUSLocaleSettings);
        }
        currentLocale.settings = utils.assignDeep(currentLocale.settings, settingsToUpdate);
    }

    /**
     * Updates the texts for the current locale
     * @param texts A plain JS object that contains textual resources
     */
    export function updateLocaleTexts(texts: TextResources) {
        if (typeof texts !== 'object') {
            console.error('Wrong parameter type in updateLocaleTexts function call.' +
                    'The first parameter (localeId) is not necessary. Use updateLocaleTexts(texts) instead');
            return;
        }
        mapInfo({localeId: currentLocale.localeId, texts: texts});

        utils.assignDeep(currentLocale.texts, texts);
    }

    export function updateDefaultTexts(texts: TextResources)
    {
        for (let localeId in allLocales) {
            let locale = allLocales[localeId];
            locale.texts = utils.assignDeep({}, texts, locale.texts);
        }
        currentLocale.texts = utils.assignDeep({}, texts, currentLocale.texts);
    }

    /**
     * Updates the information for the specified locale.
     * @param localeId The locale ID (like 'en', 'de', 'uk', etc). 
     * If the locale does exist yet - it will be added
     * @param localeInfo  a LocaleInfo object that contains the locale settings and textual resources
     */
    export function updateLocaleInfo(localeId: string, localeData: LocaleInfo) : void {
        mapInfo(localeData);

        let localeInfoToUpdate = currentLocale;

        if (localeId) {
            if (!localeData.localeId) {
                localeData.localeId = localeId;
            }
    
            localeInfoToUpdate = allLocales[localeId];
            if (!localeInfoToUpdate) {
                localeInfoToUpdate = utils.assignDeep({}, defaultLocale);
                allLocales[localeId] = localeInfoToUpdate;
            }    
        }
        utils.assignDeep(localeInfoToUpdate, localeData);
    }

    /**
     * Adds the locale.
     * @param localeId The locale ID (like 'en', 'de', 'uk', etc). 
     * If the locale does exist yet - it will be created
     * @param localeInfo - a LocaleInfo object that contains the locale settings and textual resources
     */
    export function addLocale(localeId: string, localeInfo: LocaleInfo) {       
        updateLocaleInfo(localeId, localeInfo);
    }

    /**
     * Overwrites some locale settings (date/time formats) with the formats used in browser's current language
     */
    function determineSettingsByLocale(localeId : string) : void {
        const now = new Date(2020, 5, 7, 19, 34, 56, 88);
        
        const dateOptions : Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };

        const timeOptions : Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' };

        const dateStr = now.toLocaleDateString(localeId, dateOptions);
        const timeStr = now.toLocaleTimeString(localeId, timeOptions);

        let dateFormat = dateStr
            .replace('07', 'dd')
            .replace('7', 'd')
            .replace('06', 'MM')
            .replace('6', 'M')
            .replace('2020', 'yyyy')
            .replace('20', 'yy');

        let timeFormat = timeStr
            .replace('19', 'HH')
            .replace('07', 'hh')
            .replace('7', 'h')
            .replace('34', 'mm')
            .replace('56', 'ss')
            .replace('PM', 'tt');                   

        if (!currentLocale.settings) {
            currentLocale.settings = {};
        }

        const localeSettings = {
            shortDateFormat: dateFormat,
            shortTimeFormat: timeFormat    
        };

        updateLocaleSettings(localeSettings);
    }

    function loadBrowserLocaleSettings() : void {
        const lang = typeof navigator === 'object' ? navigator.language : undefined;

        determineSettingsByLocale(lang);
    }

    export function resetLocales() {
        if (!currentLocale) {
            currentLocale = utils.assignDeep({}, defaultLocale);
            loadBrowserLocaleSettings();
        }
    }

    export function dateTimeToStr(dateTime: Date, dataType: DataType, format?: string): string {
        if (format) {
            if (format == 'd') {
                format = buildShortDateTimeFormat(DataType.Date);
            }
            else if (format == 'D') {
                format = buildLongDateTimeFormat(DataType.Date);
            }
            else if (format == 'f') {
                format = buildShortDateTimeFormat(DataType.DateTime);
            }
            else if (format == 'F') {
                format = buildLongDateTimeFormat(DataType.DateTime);
            }
        }
        else {
            format = buildShortDateTimeFormat(dataType);
        }

        return utils.dateTimeToStr(dateTime, format);
    }

    function buildShortDateTimeFormat(dataType: DataType): string {
        const localeSettings = getLocaleSettings();
        let format: string;
        switch (dataType) {
            case DataType.Date:
                format = localeSettings.shortDateFormat;
                break;
            case DataType.Time:
                format = localeSettings.shortTimeFormat;
                break;
            default:
                format = localeSettings.shortDateFormat + ' ' + localeSettings.shortTimeFormat;
                break;
        }

        return format;
    }

    function buildLongDateTimeFormat(dataType: DataType) {
        const localeSettings = getLocaleSettings();
        let format: string;
        switch (dataType) {
            case DataType.Date:
                format = localeSettings.longDateFormat;
                break;
            case DataType.Time:
                format = localeSettings.longTimeFormat;
                break;
            default:
                format = localeSettings.longDateFormat + ' ' + localeSettings.longTimeFormat;
                break;
        }

        return format;
    }

    export function numberToStr(number: number, format?: string): string {
        if (format && format.length > 0) {
            const type = format.charAt(0).toUpperCase();
            if (type === 'S') {
                return formatWithSequence(number, format.slice(1));
            }
            else if (['D', 'F', 'C'].indexOf(type) >= 0) {
                const locale = getCurrentLocale();
                return number.toLocaleString(locale, getNumberFormatOptions(format));
            }
            else {
                return convertWithMask(Math.trunc(number), format);
            }
        }

        const localeSettings = getLocaleSettings();
        return utils.numberToStr(number, localeSettings.decimalSeparator);
    }    

    export function booleanToStr(bool: boolean, format?: string) {

        if (format && format.length > 0) {
            const type = format.charAt(0).toUpperCase();
            if (type === 'S') {
                const values = format.slice(1).split('|');
                if (values.length > 1) {
                    const value = values[(bool) ? 1 : 0];
                    return i18n.getText(value) || value;
                }
            }
        }
        return `${bool}`;
    }

    const cachedSequenceFormats: { [format: string]: {[key: number]: string} } = {};

    function formatWithSequence(number: number, format: string): string {
        if (!cachedSequenceFormats[format]) {

            // parse and save in cache format values 
            const values = format.split('|')
                .filter(v => v.length > 0)
                .map(v => v.split('='));

            cachedSequenceFormats[format] = {}
            if (values.length > 0) {
                if (values[0].length > 1) {
                    for (const value of values) {
                        cachedSequenceFormats[format][Number.parseInt(value[1])] = value[0];
                    }
                }
                else {
                    values.forEach((value, index) => {
                        cachedSequenceFormats[format][index] = value[0];
                    });
                }
            }
          
        }

        const values = cachedSequenceFormats[format];
        if (values[number] !== undefined) {
            const value = values[number];
            return i18n.getText(value) || value;
        }

        return number.toString();
    }

    function convertWithMask(number: number, mask: string) {
        let value = number.toString();
        let result = '';
        let index = value.length - 1;
        
        for(let i = mask.length - 1; i >= 0; i--) {
            
            const ch = mask.charAt(i);

            if (ch === '#' || ch === '0') {
                if (index >= 0) {
                    result += value.charAt(index);
                    index--;
                }
                else {
                    if (ch === '0') {
                        result += 0;
                    }
                }
            }
            else {
                result += ch;
            }
        }
        
        return result.split('').reverse().join('');
    }

    function getNumberFormatOptions(format: string): Intl.NumberFormatOptions {
        const localeSettings = getLocaleSettings();
        const type = format[0].toUpperCase();
        const digits = (format.length > 1) 
            ? Number.parseInt(format.slice(1))
            : type == 'D' ? 1 : 2;
            
        switch (type) {
            case 'D':
                return {
                    style: 'decimal',
                    useGrouping: false,
                    minimumIntegerDigits: digits
                }
            case 'C': 
                return {
                    style: 'currency',
                    currency: localeSettings.currency,
                    minimumFractionDigits: digits
                }
            default: 
                return {
                    style: 'decimal',
                    minimumFractionDigits: digits,
                    maximumFractionDigits: digits
                }
        }
    }
}

