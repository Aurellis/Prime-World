/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/*
//@line 44 "e:\builds\moz2_slave\mozilla-1.9.1-win32-xulrunner\build\toolkit\mozapps\extensions\src\nsExtensionManager.js.in"
*/

//
// TODO:
// - better logging
//

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

const PREF_EM_CHECK_COMPATIBILITY     = "extensions.checkCompatibility";
const PREF_EM_CHECK_UPDATE_SECURITY   = "extensions.checkUpdateSecurity";
const PREF_EM_LAST_APP_VERSION        = "extensions.lastAppVersion";
const PREF_EM_ENABLED_ITEMS           = "extensions.enabledItems";
const PREF_UPDATE_COUNT               = "extensions.update.count";
const PREF_UPDATE_DEFAULT_URL         = "extensions.update.url";
const PREF_EM_NEW_ADDONS_LIST         = "extensions.newAddons";
const PREF_EM_IGNOREMTIMECHANGES      = "extensions.ignoreMTimeChanges";
const PREF_EM_DISABLEDOBSOLETE        = "extensions.disabledObsolete";
const PREF_EM_EXTENSION_FORMAT        = "extensions.%UUID%.";
const PREF_EM_ITEM_UPDATE_ENABLED     = "extensions.%UUID%.update.enabled";
const PREF_EM_UPDATE_ENABLED          = "extensions.update.enabled";
const PREF_EM_ITEM_UPDATE_URL         = "extensions.%UUID%.update.url";
const PREF_EM_DSS_ENABLED             = "extensions.dss.enabled";
const PREF_DSS_SWITCHPENDING          = "extensions.dss.switchPending";
const PREF_DSS_SKIN_TO_SELECT         = "extensions.lastSelectedSkin";
const PREF_GENERAL_SKINS_SELECTEDSKIN = "general.skins.selectedSkin";
const PREF_EM_LOGGING_ENABLED         = "extensions.logging.enabled";
const PREF_EM_UPDATE_INTERVAL         = "extensions.update.interval";
const PREF_UPDATE_NOTIFYUSER          = "extensions.update.notifyUser";
const PREF_MATCH_OS_LOCALE            = "intl.locale.matchOS";
const PREF_SELECTED_LOCALE            = "general.useragent.locale";

const DIR_EXTENSIONS                  = "extensions";
const DIR_CHROME                      = "chrome";
const DIR_STAGE                       = "staged-xpis";
const FILE_EXTENSIONS                 = "extensions.rdf";
const FILE_EXTENSION_MANIFEST         = "extensions.ini";
const FILE_EXTENSIONS_STARTUP_CACHE   = "extensions.cache";
const FILE_EXTENSIONS_LOG             = "extensions.log";
const FILE_AUTOREG                    = ".autoreg";
const FILE_INSTALL_MANIFEST           = "install.rdf";
const FILE_CONTENTS_MANIFEST          = "contents.rdf";
const FILE_CHROME_MANIFEST            = "chrome.manifest";

const UNKNOWN_XPCOM_ABI               = "unknownABI";

const FILE_DEFAULT_THEME_JAR          = "classic.jar";
const TOOLKIT_ID                      = "toolkit@mozilla.org"

const KEY_PROFILEDIR                  = "ProfD";
const KEY_PROFILEDS                   = "ProfDS";
const KEY_APPDIR                      = "XCurProcD";
const KEY_TEMPDIR                     = "TmpD";

const EM_ACTION_REQUESTED_TOPIC       = "em-action-requested";
const EM_ITEM_INSTALLED               = "item-installed";
const EM_ITEM_UPGRADED                = "item-upgraded";
const EM_ITEM_UNINSTALLED             = "item-uninstalled";
const EM_ITEM_ENABLED                 = "item-enabled";
const EM_ITEM_DISABLED                = "item-disabled";
const EM_ITEM_CANCEL                  = "item-cancel-action";

const OP_NONE                         = "";
const OP_NEEDS_INSTALL                = "needs-install";
const OP_NEEDS_UPGRADE                = "needs-upgrade";
const OP_NEEDS_UNINSTALL              = "needs-uninstall";
const OP_NEEDS_ENABLE                 = "needs-enable";
const OP_NEEDS_DISABLE                = "needs-disable";

const KEY_APP_PROFILE                 = "app-profile";
const KEY_APP_GLOBAL                  = "app-global";
const KEY_APP_SYSTEM_LOCAL            = "app-system-local";
const KEY_APP_SYSTEM_SHARE            = "app-system-share";
const KEY_APP_SYSTEM_USER             = "app-system-user";

const CATEGORY_INSTALL_LOCATIONS      = "extension-install-locations";
const CATEGORY_UPDATE_PARAMS          = "extension-update-params";

const PREFIX_NS_EM                    = "http://www.mozilla.org/2004/em-rdf#";
const PREFIX_NS_CHROME                = "http://www.mozilla.org/rdf/chrome#";
const PREFIX_ITEM_URI                 = "urn:mozilla:item:";
const PREFIX_EXTENSION                = "urn:mozilla:extension:";
const PREFIX_THEME                    = "urn:mozilla:theme:";
const RDFURI_INSTALL_MANIFEST_ROOT    = "urn:mozilla:install-manifest";
const RDFURI_ITEM_ROOT                = "urn:mozilla:item:root"
const RDFURI_DEFAULT_THEME            = "urn:mozilla:item:{972ce4c6-7e08-4474-a285-3208198ce6fd}";
const XMLURI_PARSE_ERROR              = "http://www.mozilla.org/newlayout/xml/parsererror.xml"

const URI_GENERIC_ICON_XPINSTALL      = "chrome://mozapps/skin/xpinstall/xpinstallItemGeneric.png";
const URI_GENERIC_ICON_THEME          = "chrome://mozapps/skin/extensions/themeGeneric.png";
const URI_XPINSTALL_CONFIRM_DIALOG    = "chrome://mozapps/content/xpinstall/xpinstallConfirm.xul";
const URI_EXTENSIONS_PROPERTIES       = "chrome://mozapps/locale/extensions/extensions.properties";
const URI_BRAND_PROPERTIES            = "chrome://branding/locale/brand.properties";
const URI_DOWNLOADS_PROPERTIES        = "chrome://mozapps/locale/downloads/downloads.properties";
const URI_EXTENSION_UPDATE_DIALOG     = "chrome://mozapps/content/extensions/update.xul";
const URI_EXTENSION_LIST_DIALOG       = "chrome://mozapps/content/extensions/list.xul";

const INSTALLERROR_SUCCESS               = 0;
const INSTALLERROR_INVALID_VERSION       = -1;
const INSTALLERROR_INVALID_GUID          = -2;
const INSTALLERROR_INCOMPATIBLE_VERSION  = -3;
const INSTALLERROR_PHONING_HOME          = -4;
const INSTALLERROR_INCOMPATIBLE_PLATFORM = -5;
const INSTALLERROR_BLOCKLISTED           = -6;
const INSTALLERROR_INSECURE_UPDATE       = -7;
const INSTALLERROR_INVALID_MANIFEST      = -8;
const INSTALLERROR_RESTRICTED            = -9;
const INSTALLERROR_SOFTBLOCKED           = -10;

const MODE_RDONLY   = 0x01;
const MODE_WRONLY   = 0x02;
const MODE_CREATE   = 0x08;
const MODE_APPEND   = 0x10;
const MODE_TRUNCATE = 0x20;

const PERMS_FILE      = 0644;
const PERMS_DIRECTORY = 0755;

const REQ_VERSION = 2;

var gApp  = null;
var gPref = null;
var gRDF  = null;
var gOS   = null;
var gEmSingleton          = null;
var gBlocklist            = null;
var gXPCOMABI             = null;
var gOSTarget             = null;
var gConsole              = null;
var gInstallManifestRoot  = null;
var gVersionChecker       = null;
var gDirService           = null;
var gLoggingEnabled       = null;
var gCheckCompatibility   = true;
var gCheckUpdateSecurity  = true;
var gLocale               = "en-US";
var gFirstRun             = false;
var gAllowFlush           = true;
var gDSNeedsFlush         = false;
var gManifestNeedsFlush   = false;

/**
 * Valid GUIDs fit this pattern.
 */
var gIDTest = /^(\{[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\}|[a-z0-9-\._]*\@[a-z0-9-\._]+)$/i;

// shared code for suppressing bad cert dialogs
//@line 41 "e:\builds\moz2_slave\mozilla-1.9.1-win32-xulrunner\build\toolkit\mozapps\shared\src\badCertHandler.js"

/**
 * Only allow built-in certs for HTTPS connections.  See bug 340198.
 */
function checkCert(channel) {
  if (!channel.originalURI.schemeIs("https"))  // bypass
    return;

  const Ci = Components.interfaces;  
  var cert =
      channel.securityInfo.QueryInterface(Ci.nsISSLStatusProvider).
      SSLStatus.QueryInterface(Ci.nsISSLStatus).serverCert;

  var issuer = cert.issuer;
  while (issuer && !cert.equals(issuer)) {
    cert = issuer;
    issuer = cert.issuer;
  }

  var errorstring = "cert issuer is not built-in";
  if (!issuer)
    throw errorstring;

  issuer = issuer.QueryInterface(Ci.nsIX509Cert3);
  var tokenNames = issuer.getAllTokenNames({});

  if (!tokenNames.some(isBuiltinToken))
    throw errorstring;
}

function isBuiltinToken(tokenName) {
  return tokenName == "Builtin Object Token";
}

/**
 * This class implements nsIBadCertListener.  Its job is to prevent "bad cert"
 * security dialogs from being shown to the user.  It is better to simply fail
 * if the certificate is bad. See bug 304286.
 */
function BadCertHandler() {
}
BadCertHandler.prototype = {

  // nsIChannelEventSink
  onChannelRedirect: function(oldChannel, newChannel, flags) {
    // make sure the certificate of the old channel checks out before we follow
    // a redirect from it.  See bug 340198.
    checkCert(oldChannel);
  },

  // Suppress any certificate errors
  notifyCertProblem: function(socketInfo, status, targetSite) {
    return true;
  },

  // Suppress any ssl errors
  notifySSLError: function(socketInfo, error, targetSite) {
    return true;
  },

  // nsIInterfaceRequestor
  getInterface: function(iid) {
    return this.QueryInterface(iid);
  },

  // nsISupports
  QueryInterface: function(iid) {
    if (!iid.equals(Components.interfaces.nsIChannelEventSink) &&
        !iid.equals(Components.interfaces.nsIBadCertListener2) &&
        !iid.equals(Components.interfaces.nsISSLErrorListener) &&
        !iid.equals(Components.interfaces.nsIInterfaceRequestor) &&
        !iid.equals(Components.interfaces.nsISupports))
      throw Components.results.NS_ERROR_NO_INTERFACE;
    return this;
  }
};
//@line 196 "e:\builds\moz2_slave\mozilla-1.9.1-win32-xulrunner\build\toolkit\mozapps\extensions\src\nsExtensionManager.js.in"

/**
 * Creates a Version Checker object.
 * @returns A handle to the global Version Checker service.
 */
function getVersionChecker() {
  if (!gVersionChecker) {
    gVersionChecker = Cc["@mozilla.org/xpcom/version-comparator;1"].
                      getService(Ci.nsIVersionComparator);
  }
  return gVersionChecker;
}

var BundleManager = {
  /**
  * Creates and returns a String Bundle at the specified URI
  * @param   bundleURI
  *          The URI of the bundle to load
  * @returns A nsIStringBundle which was retrieved.
  */
  getBundle: function BundleManager_getBundle(bundleURI) {
    var sbs = Cc["@mozilla.org/intl/stringbundle;1"].
              getService(Ci.nsIStringBundleService);
    return sbs.createBundle(bundleURI);
  },

  _appName: "",

  /**
   * The Application's display name.
   */
  get appName() {
    if (!this._appName) {
      var brandBundle = this.getBundle(URI_BRAND_PROPERTIES)
      this._appName = brandBundle.GetStringFromName("brandShortName");
    }
    return this._appName;
  }
};

///////////////////////////////////////////////////////////////////////////////
//
// Utility Functions
//
function EM_NS(property) {
  return PREFIX_NS_EM + property;
}

function CHROME_NS(property) {
  return PREFIX_NS_CHROME + property;
}

function EM_R(property) {
  return gRDF.GetResource(EM_NS(property));
}

function EM_L(literal) {
  return gRDF.GetLiteral(literal);
}

function EM_I(integer) {
  return gRDF.GetIntLiteral(integer);
}

function EM_D(integer) {
  return gRDF.GetDateLiteral(integer);
}

/**
 * Gets a preference value, handling the case where there is no default.
 * @param   func
 *          The name of the preference function to call, on nsIPrefBranch
 * @param   preference
 *          The name of the preference
 * @param   defaultValue
 *          The default value to return in the event the preference has
 *          no setting
 * @returns The value of the preference, or undefined if there was no
 *          user or default value.
 */
function getPref(func, preference, defaultValue) {
  try {
    return gPref[func](preference);
  }
  catch (e) {
  }
  return defaultValue;
}

/**
 * Initializes a RDF Container at a URI in a datasource.
 * @param   datasource
 *          The datasource the container is in
 * @param   root
 *          The RDF Resource which is the root of the container.
 * @returns The nsIRDFContainer, initialized at the root.
 */
function getContainer(datasource, root) {
  var ctr = Cc["@mozilla.org/rdf/container;1"].
            createInstance(Ci.nsIRDFContainer);
  ctr.Init(datasource, root);
  return ctr;
}

/**
 * Gets a RDF Resource for item with the given ID
 * @param   id
 *          The GUID of the item to construct a RDF resource to the
 *          active item for
 * @returns The RDF Resource to the Active item.
 */
function getResourceForID(id) {
  return gRDF.GetResource(PREFIX_ITEM_URI + id);
}

/**
 * Construct a nsIUpdateItem with the supplied metadata
 * ...
 */
function makeItem(id, version, locationKey, minVersion, maxVersion, name,
                  updateURL, updateHash, iconURL, updateRDF, updateKey, type, 
                  targetAppID) {
  var item = new UpdateItem();
  item.init(id, version, locationKey, minVersion, maxVersion, name,
            updateURL, updateHash, iconURL, updateRDF, updateKey, type,
            targetAppID);
  return item;
}

/**
 * Gets the specified directory at the specified hierarchy under a
 * Directory Service key.
 * @param   key
 *          The Directory Service Key to start from
 * @param   pathArray
 *          An array of path components to locate beneath the directory
 *          specified by |key|
 * @return  nsIFile object for the location specified. If the directory
 *          requested does not exist, it is created, along with any
 *          parent directories that need to be created.
 */
function getDir(key, pathArray) {
  return getDirInternal(key, pathArray, true);
}

/**
 * Gets the specified directory at the specified hierarchy under a
 * Directory Service key.
 * @param   key
 *          The Directory Service Key to start from
 * @param   pathArray
 *          An array of path components to locate beneath the directory
 *          specified by |key|
 * @return  nsIFile object for the location specified. If the directory
 *          requested does not exist, it is NOT created.
 */
function getDirNoCreate(key, pathArray) {
  return getDirInternal(key, pathArray, false);
}

/**
 * Gets the specified directory at the specified hierarchy under a
 * Directory Service key.
 * @param   key
 *          The Directory Service Key to start from
 * @param   pathArray
 *          An array of path components to locate beneath the directory
 *          specified by |key|
 * @param   shouldCreate
 *          true if the directory hierarchy specified in |pathArray|
 *          should be created if it does not exist,
 *          false otherwise.
 * @return  nsIFile object for the location specified.
 */
function getDirInternal(key, pathArray, shouldCreate) {
  if (!gDirService) {
    gDirService = Cc["@mozilla.org/file/directory_service;1"].
                  getService(Ci.nsIProperties);
  }

  var dir = gDirService.get(key, Ci.nsILocalFile);
  for (var i = 0; i < pathArray.length; ++i) {
    dir.append(pathArray[i]);
    if (shouldCreate && !dir.exists())
      dir.create(Ci.nsILocalFile.DIRECTORY_TYPE, PERMS_DIRECTORY);
  }
  dir.followLinks = false;
  return dir;
}

/**
 * Gets the file at the specified hierarchy under a Directory Service key.
 * @param   key
 *          The Directory Service Key to start from
 * @param   pathArray
 *          An array of path components to locate beneath the directory
 *          specified by |key|. The last item in this array must be the
 *          leaf name of a file.
 * @return  nsIFile object for the file specified. The file is NOT created
 *          if it does not exist, however all required directories along
 *          the way are.
 */
function getFile(key, pathArray) {
  var file = getDir(key, pathArray.slice(0, -1));
  file.append(pathArray[pathArray.length - 1]);
  return file;
}

/**
 * Gets the descriptor of a directory as a relative path to common base
 * directories (profile, user home, app install dir, etc).
 *
 * @param   itemLocation
 *          The nsILocalFile representing the item's directory.
 * @param   installLocation the nsIInstallLocation for this item
 */
function getDescriptorFromFile(itemLocation, installLocation) {
  var baseDir = installLocation.location;

  if (baseDir && baseDir.contains(itemLocation, true)) {
    return "rel%" + itemLocation.getRelativeDescriptor(baseDir);
  }

  return "abs%" + itemLocation.persistentDescriptor;
}

function getAbsoluteDescriptor(itemLocation) {
  return itemLocation.persistentDescriptor;
}

/**
 * Initializes a Local File object based on a descriptor
 * provided by "getDescriptorFromFile".
 *
 * @param   descriptor
 *          The descriptor that locates the directory
 * @param   installLocation
 *          The nsIInstallLocation object for this item.
 * @returns The nsILocalFile object representing the location of the item
 */
function getFileFromDescriptor(descriptor, installLocation) {
  var location = Cc["@mozilla.org/file/local;1"].
                 createInstance(Ci.nsILocalFile);

  var m = descriptor.match(/^(abs|rel)\%(.*)$/);
  if (!m)
    throw Cr.NS_ERROR_INVALID_ARG;

  if (m[1] == "rel") {
    location.setRelativeDescriptor(installLocation.location, m[2]);
  }
  else {
    location.persistentDescriptor = m[2];
  }

  return location;
}

/**
 * Determines if a file is an item package - either a XPI or a JAR file.
 * @param   file
 *          The file to check
 * @returns true if the file is an item package, false otherwise.
 */
function fileIsItemPackage(file) {
  var fileURL = getURIFromFile(file);
  if (fileURL instanceof Ci.nsIURL)
    var extension = fileURL.fileExtension.toLowerCase();
  return extension == "xpi" || extension == "jar";
}

/**
 * Opens a safe file output stream for writing.
 * @param   file
 *          The file to write to.
 * @param   modeFlags
 *          (optional) File open flags. Can be undefined.
 * @returns nsIFileOutputStream to write to.
 */
function openSafeFileOutputStream(file, modeFlags) {
  var fos = Cc["@mozilla.org/network/safe-file-output-stream;1"].
            createInstance(Ci.nsIFileOutputStream);
  if (modeFlags === undefined)
    modeFlags = MODE_WRONLY | MODE_CREATE | MODE_TRUNCATE;
  if (!file.exists())
    file.create(Ci.nsILocalFile.NORMAL_FILE_TYPE, PERMS_FILE);
  fos.init(file, modeFlags, PERMS_FILE, 0);
  return fos;
}

/**
 * Closes a safe file output stream.
 * @param   stream
 *          The stream to close.
 */
function closeSafeFileOutputStream(stream) {
  if (stream instanceof Ci.nsISafeOutputStream)
    stream.finish();
  else
    stream.close();
}

/**
 * Deletes a directory and its children. First it tries nsIFile::Remove(true).
 * If that fails it will fall back to recursing, setting the appropriate
 * permissions, and deleting the current entry. This is needed for when we have
 * rights to delete a directory but there are entries that have a read-only
 * attribute (e.g. a copy restore from a read-only CD, etc.)
 * @param   dir
 *          A nsIFile for the directory to be deleted
 */
function removeDirRecursive(dir) {
  try {
    dir.remove(true);
    return;
  }
  catch (e) {
  }

  var dirEntries = dir.directoryEntries;
  while (dirEntries.hasMoreElements()) {
    var entry = dirEntries.getNext().QueryInterface(Ci.nsIFile);

    if (entry.isDirectory()) {
      removeDirRecursive(entry);
    }
    else {
      entry.permissions = PERMS_FILE;
      entry.remove(false);
    }
  }
  dir.permissions = PERMS_DIRECTORY;
  dir.remove(true);
}

/**
 * Logs a string to the error console.
 * @param   string
 *          The string to write to the error console.
 */
function LOG(string) {
  if (gLoggingEnabled) {
    dump("*** " + string + "\n");
    if (gConsole)
      gConsole.logStringMessage(string);
  }
}

/**
 * Logs a string to the error console and to a permanent log file. 
 * @param   string
 *          The string to write out.
 */  
function ERROR(string) {
  LOG(string);
  try {
    var tstamp = new Date();
    var logfile = getFile(KEY_PROFILEDIR, [FILE_EXTENSIONS_LOG]);
    var stream = Cc["@mozilla.org/network/file-output-stream;1"].
                 createInstance(Ci.nsIFileOutputStream);
    stream.init(logfile, 0x02 | 0x08 | 0x10, 0666, 0); // write, create, append
    var writer = Cc["@mozilla.org/intl/converter-output-stream;1"].
                 createInstance(Ci.nsIConverterOutputStream);
    writer.init(stream, "UTF-8", 0, 0x0000);
    string = tstamp.toLocaleFormat("%Y-%m-%d %H:%M:%S - ") + string;
    writer.writeString(string + "\n");
    writer.close();
  }
  catch (e) { }
}

/**
 * Randomize the specified file name. Used to force RDF to bypass the cache
 * when loading certain types of files.
 * @param   fileName
 *          A file name to randomize, e.g. install.rdf
 * @returns A randomized file name, e.g. install-xyz.rdf
 */
function getRandomFileName(fileName) {
  var extensionDelimiter = fileName.lastIndexOf(".");
  var prefix = fileName.substr(0, extensionDelimiter);
  var suffix = fileName.substr(extensionDelimiter);

  var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  var nameString = prefix + "-";
  for (var i = 0; i < 3; ++i) {
    var index = Math.round((Math.random()) * characters.length);
    nameString += characters.charAt(index);
  }
  return nameString + "." + suffix;
}

/**
 * Get the RDF URI prefix of a nsIUpdateItem type. This function should be used
 * ONLY to support Firefox 1.0 Update RDF files! Item URIs in the datasource
 * are NOT prefixed.
 * @param   type
 *          The nsIUpdateItem type to find a RDF URI prefix for
 * @returns The RDF URI prefix.
 */
function getItemPrefix(type) {
  if (type & Ci.nsIUpdateItem.TYPE_EXTENSION)
    return PREFIX_EXTENSION;
  else if (type & Ci.nsIUpdateItem.TYPE_THEME)
    return PREFIX_THEME;
  return PREFIX_ITEM_URI;
}

/**
 * Trims a prefix from a string.
 * @param   string
 *          The source string
 * @param   prefix
 *          The prefix to remove.
 * @returns The suffix (string - prefix)
 */
function stripPrefix(string, prefix) {
  return string.substr(prefix.length);
}

/**
 * Gets a File URL spec for a nsIFile
 * @param   file
 *          The file to get a file URL spec to
 * @returns The file URL spec to the file
 */
function getURLSpecFromFile(file) {
  var ioServ = Cc["@mozilla.org/network/io-service;1"].
               getService(Ci.nsIIOService);
  var fph = ioServ.getProtocolHandler("file")
                  .QueryInterface(Ci.nsIFileProtocolHandler);
  return fph.getURLSpecFromFile(file);
}

/**
 * Constructs a URI to a spec.
 * @param   spec
 *          The spec to construct a URI to
 * @returns The nsIURI constructed.
 */
function newURI(spec) {
  var ioServ = Cc["@mozilla.org/network/io-service;1"].
               getService(Ci.nsIIOService);
  return ioServ.newURI(spec, null, null);
}

/**
 * Constructs a File URI to a nsIFile
 * @param   file
 *          The file to construct a File URI to
 * @returns The file URI to the file
 */
function getURIFromFile(file) {
  var ioServ = Cc["@mozilla.org/network/io-service;1"].
               getService(Ci.nsIIOService);
  return ioServ.newFileURI(file);
}

/**
 * @returns Whether or not we are currently running in safe mode.
 */
function inSafeMode() {
  return gApp.inSafeMode;
}

/**
 * Extract the string value from a RDF Literal or Resource
 * @param   literalOrResource
 *          RDF String Literal or Resource
 * @returns String value of the literal or resource, or undefined if the object
 *          supplied is not a RDF string literal or resource.
 */
function stringData(literalOrResource) {
  if (literalOrResource instanceof Ci.nsIRDFLiteral)
    return literalOrResource.Value;
  if (literalOrResource instanceof Ci.nsIRDFResource)
    return literalOrResource.Value;
  return undefined;
}

/**
 * Extract the integer value of a RDF Literal
 * @param   literal
 *          nsIRDFInt literal
 * @return  integer value of the literal
 */
function intData(literal) {
  if (literal instanceof Ci.nsIRDFInt)
    return literal.Value;
  return undefined;
}

/**
 * Gets a property from an install manifest.
 * @param   installManifest
 *          An Install Manifest datasource to read from
 * @param   property
 *          The name of a proprety to read (sans EM_NS)
 * @returns The literal value of the property, or undefined if the property has
 *          no value.
 */
function getManifestProperty(installManifest, property) {
  var target = installManifest.GetTarget(gInstallManifestRoot,
                                         gRDF.GetResource(EM_NS(property)), true);
  var val = stringData(target);
  return val === undefined ? intData(target) : val;
}

/**
 * Given an Install Manifest Datasource, retrieves the type of item the manifest
 * describes.
 * @param   installManifest
 *          The Install Manifest Datasource.
 * @return  The nsIUpdateItem type of the item described by the manifest
 *          returns TYPE_EXTENSION if attempts to determine the type fail.
 */
function getAddonTypeFromInstallManifest(installManifest) {
  var target = installManifest.GetTarget(gInstallManifestRoot,
                                         gRDF.GetResource(EM_NS("type")), true);
  if (target) {
    var type = stringData(target);
    return type === undefined ? intData(target) : parseInt(type);
  }

  // Firefox 1.0 and earlier did not support addon-type annotation on the
  // Install Manifest, so we fall back to a theme-only property to
  // differentiate.
  if (getManifestProperty(installManifest, "internalName") !== undefined)
    return Ci.nsIUpdateItem.TYPE_THEME;

  // If no type is provided, default to "Extension"
  return Ci.nsIUpdateItem.TYPE_EXTENSION;
}

/**
 * Shows a message about an incompatible Extension/Theme.
 * @param   installData
 *          An Install Data object from |getInstallData|
 */
function showIncompatibleError(installData) {
  var extensionStrings = BundleManager.getBundle(URI_EXTENSIONS_PROPERTIES);
  var params = [extensionStrings.GetStringFromName("type-" + installData.type)];
  var title = extensionStrings.formatStringFromName("incompatibleTitle",
                                                    params, params.length);
  params = [installData.name, installData.version, BundleManager.appName,
            gApp.version];
  var message = extensionStrings.formatStringFromName("incompatibleMessage",
                                                      params, params.length);
  var ps = Cc["@mozilla.org/embedcomp/prompt-service;1"].
           getService(Ci.nsIPromptService);
  ps.alert(null, title, message);
}

/**
 * Shows a message.
 * @param   titleKey
 *          String key of the title string in the Extensions localization file.
 * @param   messageKey
 *          String key of the message string in the Extensions localization file.
 * @param   messageParams
 *          Array of strings to be substituted into |messageKey|. Can be null.
 */
function showMessage(titleKey, titleParams, messageKey, messageParams) {
  var extensionStrings = BundleManager.getBundle(URI_EXTENSIONS_PROPERTIES);
  if (titleParams && titleParams.length > 0) {
    var title = extensionStrings.formatStringFromName(titleKey, titleParams,
                                                      titleParams.length);
  }
  else
    title = extensionStrings.GetStringFromName(titleKey);

  if (messageParams && messageParams.length > 0) {
    var message = extensionStrings.formatStringFromName(messageKey, messageParams,
                                                        messageParams.length);
  }
  else
    message = extensionStrings.GetStringFromName(messageKey);
  var ps = Cc["@mozilla.org/embedcomp/prompt-service;1"].
           getService(Ci.nsIPromptService);
  ps.alert(null, title, message);
}

/**
 * Shows a dialog for a blocklisted item. For soft blocked items this will
 * return true if the item should still be installed
 * @param   item
 *          The nsIUpdateItem that is blocklisted
 * @param   softblocked
 *          True if this item is only soft blocked and may still be installed.
 */
function showBlocklistMessage(item, softblocked) {
  var params = Cc["@mozilla.org/embedcomp/dialogparam;1"].
               createInstance(Ci.nsIDialogParamBlock);
  params.SetInt(0, softblocked ? 1 : 0);
  params.SetInt(1, 0);
  params.SetNumberStrings(1);
  params.SetString(0, item.name + " " + item.version);

  var wm = Cc["@mozilla.org/appshell/window-mediator;1"].
           getService(Ci.nsIWindowMediator);
  var win = wm.getMostRecentWindow("Extension:Manager");
  var ww = Cc["@mozilla.org/embedcomp/window-watcher;1"].
           getService(Ci.nsIWindowWatcher);
  ww.openWindow(win, URI_EXTENSION_LIST_DIALOG, "",
                "chrome,centerscreen,modal,dialog,titlebar", params);

  return params.GetInt(1) == 0 ? false : true;
}

/**
 * Gets a zip reader for the file specified.
 * @param   zipFile
 *          A ZIP archive to open with a nsIZipReader.
 * @return  A nsIZipReader for the file specified.
 */
function getZipReaderForFile(zipFile) {
  try {
    var zipReader = Cc["@mozilla.org/libjar/zip-reader;1"].
                    createInstance(Ci.nsIZipReader);
    zipReader.open(zipFile);
  }
  catch (e) {
    zipReader.close();
    throw e;
  }
  return zipReader;
}

/**
 * Extract a RDF file from a ZIP archive to a random location in the system
 * temp directory.
 * @param   zipFile
 *          A ZIP archive to read from
 * @param   fileName
 *          The name of the file to read from the zip.
 * @param   suppressErrors
 *          Whether or not to report errors.
 * @return  The file created in the temp directory.
 */
function extractRDFFileToTempDir(zipFile, fileName, suppressErrors) {
  var file = getFile(KEY_TEMPDIR, [getRandomFileName(fileName)]);
  try {
    var zipReader = getZipReaderForFile(zipFile);
    zipReader.extract(fileName, file);
    zipReader.close();
  }
  catch (e) {
    if (!suppressErrors) {
      showMessage("missingFileTitle", [], "missingFileMessage",
                  [BundleManager.appName, fileName]);
      throw e;
    }
  }
  return file;
}

/**
 * Gets an Install Manifest datasource from a file.
 * @param   file
 *          The nsIFile that contains the Install Manifest RDF
 * @returns The Install Manifest datasource
 */
function getInstallManifest(file) {
  var uri = getURIFromFile(file);
  try {
    var fis = Cc["@mozilla.org/network/file-input-stream;1"].
              createInstance(Ci.nsIFileInputStream);
    fis.init(file, -1, -1, false);
    var bis = Cc["@mozilla.org/network/buffered-input-stream;1"].
              createInstance(Ci.nsIBufferedInputStream);
    bis.init(fis, 4096);
    
    var rdfParser = Cc["@mozilla.org/rdf/xml-parser;1"].
                    createInstance(Ci.nsIRDFXMLParser)
    var ds = Cc["@mozilla.org/rdf/datasource;1?name=in-memory-datasource"].
             createInstance(Ci.nsIRDFDataSource);
    var listener = rdfParser.parseAsync(ds, uri);
    var channel = Cc["@mozilla.org/network/input-stream-channel;1"].
                  createInstance(Ci.nsIInputStreamChannel);
    channel.setURI(uri);
    channel.contentStream = bis;
    channel.QueryInterface(Ci.nsIChannel);
    channel.contentType = "text/xml";
  
    listener.onStartRequest(channel, null);
    try {
      var pos = 0;
      var count = bis.available();
      while (count > 0) {
        listener.onDataAvailable(channel, null, bis, pos, count);
        pos += count;
        count = bis.available();
      }
      listener.onStopRequest(channel, null, Components.results.NS_OK);
      bis.close();
      fis.close();

      var arcs = ds.ArcLabelsOut(gInstallManifestRoot);
      if (arcs.hasMoreElements())
        return ds;
    }
    catch (e) {
      listener.onStopRequest(channel, null, e.result);
      bis.close();
      fis.close();
    }
  }
  catch (e) { }

  var url = uri.QueryInterface(Ci.nsIURL);
  showMessage("malformedTitle", [], "malformedMessage",
              [BundleManager.appName, url.fileName]);
  return null;
}

/**
 * Selects the closest matching localized resource in the given RDF resource
 * @param   aDataSource The datasource to look in
 * @param   aResource   The root resource containing the localized sections
 * @returns The nsIRDFResource of the best em:localized section or null
 *          if no valid match was found
 */
function findClosestLocalizedResource(aDataSource, aResource) {
  var localizedProp = EM_R("localized");
  var localeProp = EM_R("locale");

  // Holds the best matching localized resource
  var bestmatch = null;
  // The number of locale parts it matched with
  var bestmatchcount = 0;
  // The number of locale parts in the match
  var bestpartcount = 0;

  var locales = [gLocale.toLowerCase()];
  /* If the current locale is English then it will find a match if there is
     a valid match for en-US so no point searching that locale too. */
  if (locales[0].substring(0, 3) != "en-")
    locales.push("en-us");

  for each (var locale in locales) {
    var lparts = locale.split("-");
    var localizations = aDataSource.GetTargets(aResource, localizedProp, true);
    while (localizations.hasMoreElements()) {
      var localized = localizations.getNext().QueryInterface(Ci.nsIRDFNode);
      var list = aDataSource.GetTargets(localized, localeProp, true);
      while (list.hasMoreElements()) {
        var found = stringData(list.getNext().QueryInterface(Ci.nsIRDFNode));
        if (!found)
          continue;

        found = found.toLowerCase();

        // Exact match is returned immediately
        if (locale == found)
          return localized;
  
        var fparts = found.split("-");
        /* If we have found a possible match and this one isn't any longer
           then we dont need to check further. */
        if (bestmatch && fparts.length < bestmatchcount)
          continue;
  
        // Count the number of parts that match
        var maxmatchcount = Math.min(fparts.length, lparts.length);
        var matchcount = 0;
        while (matchcount < maxmatchcount &&
               fparts[matchcount] == lparts[matchcount])
          matchcount++;
  
        /* If we matched more than the last best match or matched the same and
           this locale is less specific than the last best match. */
        if (matchcount > bestmatchcount ||
           (matchcount == bestmatchcount && fparts.length < bestpartcount)) {
          bestmatch = localized;
          bestmatchcount = matchcount;
          bestpartcount = fparts.length;
        }
      }
    }
    // If we found a valid match for this locale return it
    if (bestmatch)
      return bestmatch;
  }
  return null;
}
    
/**
 * An enumeration of items in a JS array.
 * @constructor
 */
function ArrayEnumerator(aItems) {
  if (aItems) {
    for (var i = 0; i < aItems.length; ++i) {
      if (!aItems[i])
        aItems.splice(i--, 1);
    }
    this._contents = aItems;
  } else {
    this._contents = [];
  }
}

ArrayEnumerator.prototype = {
  _index: 0,

  hasMoreElements: function ArrayEnumerator_hasMoreElements() {
    return this._index < this._contents.length;
  },

  getNext: function ArrayEnumerator_getNext() {
    return this._contents[this._index++];
  }
};

/**
 * An enumeration of files in a JS array.
 * @param   files
 *          The files to enumerate
 * @constructor
 */
function FileEnumerator(files) {
  if (files) {
    for (var i = 0; i < files.length; ++i) {
      if (!files[i])
        files.splice(i--, 1);
    }
    this._contents = files;
  } else {
    this._contents = [];
  }
}

FileEnumerator.prototype = {
  _index: 0,

  /**
   * Gets the next file in the sequence.
   */
  get nextFile() {
    if (this._index < this._contents.length)
      return this._contents[this._index++];
    return null;
  },

  /**
   * Stop enumerating. Nothing to do here.
   */
  close: function FileEnumerator_close() {
  }
};

/**
 * An object which identifies an Install Location for items, where the location
 * relationship is each item living in a directory named with its GUID under
 * the directory used when constructing this object.
 *
 * e.g. <location>\{GUID1}
 *      <location>\{GUID2}
 *      <location>\{GUID3}
 *      ...
 *
 * @param   name
 *          The string identifier of this Install Location.
 * @param   location
 *          The directory that contains the items.
 * @constructor
 */
function DirectoryInstallLocation(name, location, restricted, priority, independent) {
  this._name = name;
  if (location.exists()) {
    if (!location.isDirectory())
      throw new Error("location must be a directoy!");
  }
  else {
    try {
      location.create(Ci.nsILocalFile.DIRECTORY_TYPE, 0775);
    }
    catch (e) {
      LOG("DirectoryInstallLocation: failed to create location " +
          " directory = " + location.path + ", exception = " + e + "\n");
    }
  }

  this._location = location;
  this._locationToIDMap = {};
  this._restricted = restricted;
  this._priority = priority;
  this._independent = independent;
}
DirectoryInstallLocation.prototype = {
  _name           : "",
  _location       : null,
  _locationToIDMap: null,
  _restricted     : false,
  _priority       : 0,
  _independent    : false,
  _canAccess      : null,

  /**
   * See nsIExtensionManager.idl
   */
  get name() {
    return this._name;
  },

  /**
   * Reads a directory linked to in a file.
   * @param   file
   *          The file containing the directory path
   * @returns A nsILocalFile object representing the linked directory.
   */
  _readDirectoryFromFile: function DirInstallLocation__readDirectoryFromFile(file) {
    var fis = Cc["@mozilla.org/network/file-input-stream;1"].
              createInstance(Ci.nsIFileInputStream);
    fis.init(file, -1, -1, false);
    var line = { value: "" };
    if (fis instanceof Ci.nsILineInputStream)
      fis.readLine(line);
    fis.close();
    if (line.value) {
      var linkedDirectory = Cc["@mozilla.org/file/local;1"].
                            createInstance(Ci.nsILocalFile);
      try {
        linkedDirectory.initWithPath(line.value);
      }
      catch (e) {
        linkedDirectory.setRelativeDescriptor(file.parent, line.value);
      }

      return linkedDirectory;
    }
    return null;
  },

  /**
   * See nsIExtensionManager.idl
   */
  get itemLocations() {
    var locations = [];
    if (!this._location.exists())
      return new FileEnumerator(locations);

    try {
      var entries = this._location.directoryEntries.QueryInterface(Ci.nsIDirectoryEnumerator);
      while (true) {
        var entry = entries.nextFile;
        if (!entry)
          break;
        entry instanceof Ci.nsILocalFile;
        if (!entry.isDirectory() && gIDTest.test(entry.leafName)) {
          var linkedDirectory = this._readDirectoryFromFile(entry);
          if (linkedDirectory && linkedDirectory.exists() &&
              linkedDirectory.isDirectory()) {
            locations.push(linkedDirectory);
            this._locationToIDMap[linkedDirectory.persistentDescriptor] = entry.leafName;
          }
        }
        else
          locations.push(entry);
      }
      entries.close();
    }
    catch (e) {
    }
    return new FileEnumerator(locations);
  },

  /**
   * Retrieves the GUID for an item at the specified location.
   * @param   file
   *          The location where an item might live.
   * @returns The ID for an item that might live at the location specified.
   *
   * N.B. This function makes no promises about whether or not this path is
   *      actually maintained by this Install Location.
   */
  getIDForLocation: function DirInstallLocation_getIDForLocation(file) {
    var section = file.leafName;
    var filePD = file.persistentDescriptor;
    if (filePD in this._locationToIDMap)
      section = this._locationToIDMap[filePD];

    if (gIDTest.test(section))
      return RegExp.$1;
    return undefined;
  },

  /**
   * See nsIExtensionManager.idl
   */
  get location() {
    return this._location.clone();
  },

  /**
   * See nsIExtensionManager.idl
   */
  get restricted() {
    return this._restricted;
  },

  /**
   * See nsIExtensionManager.idl
   */
  get canAccess() {
    if (this._canAccess != null)
      return this._canAccess;

    if (!this.location.exists()) {
      this._canAccess = false;
      return false;
    }

    var testFile = this.location;
    testFile.append("Access Privileges Test");
    try {
      testFile.createUnique(Ci.nsILocalFile.DIRECTORY_TYPE, PERMS_DIRECTORY);
      testFile.remove(false);
      this._canAccess = true;
    }
    catch (e) {
      this._canAccess = false;
    }
    return this._canAccess;
  },

  /**
   * See nsIExtensionManager.idl
   */
  get priority() {
    return this._priority;
  },

  /**
   * See nsIExtensionManager.idl
   */
  getItemLocation: function DirInstallLocation_getItemLocation(id) {
    var itemLocation = this.location;
    itemLocation.append(id);
    if (itemLocation.exists() && !itemLocation.isDirectory())
      return this._readDirectoryFromFile(itemLocation);
    if (!itemLocation.exists() && this.canAccess)
      itemLocation.create(Ci.nsILocalFile.DIRECTORY_TYPE, PERMS_DIRECTORY);
    return itemLocation;
  },

  /**
   * See nsIExtensionManager.idl
   */
  itemIsManagedIndependently: function DirInstallLocation_itemIsManagedIndependently(id) {
    if (this._independent)
      return true;
    var itemLocation = this.location;
    itemLocation.append(id);
    return itemLocation.exists() && !itemLocation.isDirectory();
  },

  /**
   * See nsIExtensionManager.idl
   */
  getItemFile: function DirInstallLocation_getItemFile(id, filePath) {
    var itemLocation = this.getItemLocation(id).clone();
    var parts = filePath.split("/");
    for (var i = 0; i < parts.length; ++i)
      itemLocation.append(parts[i]);
    return itemLocation;
  },

  /**
   * Stages the specified file for later.
   * @param   file
   *          The file to stage
   * @param   id
   *          The GUID of the item the file represents
   */
  stageFile: function DirInstallLocation_stageFile(file, id) {
    var stagedFile = this.location;
    stagedFile.append(DIR_STAGE);
    stagedFile.append(id);
    stagedFile.append(file.leafName);

    // When an incompatible update is successful the file is already staged
    if (stagedFile.equals(file))
      return stagedFile;

    if (stagedFile.exists())
      stagedFile.remove(false);

    file.copyTo(stagedFile.parent, stagedFile.leafName);

    // If the file has incorrect permissions set, correct them now.
    if (!stagedFile.isWritable())
      stagedFile.permissions = PERMS_FILE;

    return stagedFile;
  },

  /**
   * Returns the most recently staged package (e.g. the last XPI or JAR in a
   * directory) for an item and removes items that do not qualify.
   * @param   id
   *          The ID of the staged package
   * @returns an nsIFile if the package exists otherwise null.
   */
  getStageFile: function DirInstallLocation_getStageFile(id) {
    var stageFile = null;
    var stageDir = this.location;
    stageDir.append(DIR_STAGE);
    stageDir.append(id);
    if (!stageDir.exists() || !stageDir.isDirectory())
      return null;
    try {
      var entries = stageDir.directoryEntries.QueryInterface(Ci.nsIDirectoryEnumerator);
      while (entries.hasMoreElements()) {
        var file = entries.nextFile;
        if (!(file instanceof Ci.nsILocalFile))
          continue;
        if (file.isDirectory())
          removeDirRecursive(file);
        else if (fileIsItemPackage(file)) {
          if (stageFile)
            stageFile.remove(false);
          stageFile = file;
        }
        else
          file.remove(false);
      }
    }
    catch (e) {
    }
    if (entries instanceof Ci.nsIDirectoryEnumerator)
      entries.close();
    return stageFile;
  },

  /**
   * Removes a file from the stage. This cleans up the stage if there is nothing
   * else left after the remove operation.
   * @param   file
   *          The file to remove.
   */
  removeFile: function DirInstallLocation_removeFile(file) {
    if (file.exists())
      file.remove(false);
    var parent = file.parent;
    var entries = parent.directoryEntries;
    try {
      // XXXrstrong calling hasMoreElements on a nsIDirectoryEnumerator after
      // it has been removed will cause a crash on Mac OS X - bug 292823
      while (parent && !parent.equals(this.location) &&
            !entries.hasMoreElements()) {
        parent.remove(false);
        parent = parent.parent;
        entries = parent.directoryEntries;
      }
      if (entries instanceof Ci.nsIDirectoryEnumerator)
        entries.close();
    }
    catch (e) {
      ERROR("DirectoryInstallLocation::removeFile: failed to remove staged " +
            " directory = " + parent.path + ", exception = " + e + "\n");
    }
  },

  QueryInterface: XPCOMUtils.generateQI([Ci.nsIInstallLocation])
};

//@line 1364 "e:\builds\moz2_slave\mozilla-1.9.1-win32-xulrunner\build\toolkit\mozapps\extensions\src\nsExtensionManager.js.in"

const nsIWindowsRegKey = Ci.nsIWindowsRegKey;

/**
 * An object that identifies the location of installed items based on entries
 * in the Windows registry.  For each application a subkey is defined that
 * contains a set of values, where the name of each value is a GUID and the
 * contents of the value is a filesystem path identifying a directory
 * containing an installed item.
 *
 * @param   name
 *          The string identifier of this Install Location.
 * @param   rootKey
 *          The root key (one of the ROOT_KEY_ values from nsIWindowsRegKey).
 * @param   restricted
 *          Indicates that the location may be restricted (e.g., this is
 *          usually true of a system level install location).
 * @param   priority
 *          The priority of this install location.
 * @constructor
 */
function WinRegInstallLocation(name, rootKey, restricted, priority) {
  this._name = name;
  this._rootKey = rootKey;
  this._restricted = restricted;
  this._priority = priority;
  this._IDToDirMap = {};
  this._DirToIDMap = {};

  // Reading the registry may throw an exception, and that's ok.  In error
  // cases, we just leave ourselves in the empty state.
  try {
    var path = this._appKeyPath + "\\Extensions";
    var key = Cc["@mozilla.org/windows-registry-key;1"].
              createInstance(nsIWindowsRegKey);
    key.open(this._rootKey, path, nsIWindowsRegKey.ACCESS_READ);
    this._readAddons(key);
  } catch (e) {
    if (key)
      key.close();
  }
}
WinRegInstallLocation.prototype = {
  _name       : "",
  _rootKey    : null,
  _restricted : false,
  _priority   : 0,
  _IDToDirMap : null,  // mapping from ID to directory object
  _DirToIDMap : null,  // mapping from directory path to ID

  /**
   * Retrieves the path of this Application's data key in the registry.
   */
  get _appKeyPath() {
    var appVendor = gApp.vendor;
    var appName = gApp.name;

//@line 1426 "e:\builds\moz2_slave\mozilla-1.9.1-win32-xulrunner\build\toolkit\mozapps\extensions\src\nsExtensionManager.js.in"

    // XULRunner-based apps may intentionally not specify a vendor:
    if (appVendor != "")
      appVendor += "\\";

    return "SOFTWARE\\" + appVendor + appName;
  },

  /**
   * Read the registry and build a mapping between GUID and directory for each
   * installed item.
   * @param   key
   *          The key that contains the GUID->path pairs
   */
  _readAddons: function RegInstallLocation__readAddons(key) {
    var count = key.valueCount;
    for (var i = 0; i < count; ++i) {
      var id = key.getValueName(i);

      var dir = Cc["@mozilla.org/file/local;1"].
                createInstance(Ci.nsILocalFile);
      dir.initWithPath(key.readStringValue(id));

      if (dir.exists() && dir.isDirectory()) {
        this._IDToDirMap[id] = dir;
        this._DirToIDMap[dir.path] = id;
      }
    }
  },

  get name() {
    return this._name;
  },

  get itemLocations() {
    var locations = [];
    for (var id in this._IDToDirMap) {
      locations.push(this._IDToDirMap[id]);
    }
    return new FileEnumerator(locations);
  },

  get location() {
    return null;
  },

  get restricted() {
    return this._restricted;
  },

  // you should never be able to write to this location
  get canAccess() {
    return false;
  },

  get priority() {
    return this._priority;
  },

  getItemLocation: function RegInstallLocation_getItemLocation(id) {
    return this._IDToDirMap[id];
  },

  getIDForLocation: function RegInstallLocation_getIDForLocation(dir) {
    return this._DirToIDMap[dir.path];
  },

  getItemFile: function RegInstallLocation_getItemFile(id, filePath) {
    var itemLocation = this.getItemLocation(id).clone();
    var parts = filePath.split("/");
    for (var i = 0; i < parts.length; ++i)
      itemLocation.append(parts[i]);
    return itemLocation;
  },

  itemIsManagedIndependently: function RegInstallLocation_itemIsManagedIndependently(id) {
    return true;
  },

  QueryInterface: XPCOMUtils.generateQI([Ci.nsIInstallLocation])
};

//@line 1509 "e:\builds\moz2_slave\mozilla-1.9.1-win32-xulrunner\build\toolkit\mozapps\extensions\src\nsExtensionManager.js.in"

/**
 * An object which handles the installation of an Extension.
 * @constructor
 */
function Installer(ds, id, installLocation, type) {
  this._ds = ds;
  this._id = id;
  this._type = type;
  this._installLocation = installLocation;
}
Installer.prototype = {
  // Item metadata
  _id: null,
  _ds: null,
  _installLocation: null,
  _metadataDS: null,

  /**
   * Gets the Install Manifest datasource we are installing from.
   */
  get metadataDS() {
    if (!this._metadataDS) {
      var metadataFile = this._installLocation
                             .getItemFile(this._id, FILE_INSTALL_MANIFEST);
      if (!metadataFile.exists())
        return null;
      this._metadataDS = getInstallManifest(metadataFile);
      if (!this._metadataDS) {
        LOG("Installer::install: metadata datasource for extension " +
            this._id + " at " + metadataFile.path + " could not be loaded. " +
            " Installation will not proceed.");
      }
    }
    return this._metadataDS;
  },

  /**
   * Installs the Extension
   * @param   file
   *          A XPI/JAR file to install from. If this is null or does not exist,
   *          the item is assumed to be an expanded directory, located at the GUID
   *          key in the supplied Install Location.
   */
  installFromFile: function Installer_installFromFile(file) {
    // Move files from the staging dir into the extension's final home.
    if (file && file.exists()) {
      this._installExtensionFiles(file);
    }

    if (!this.metadataDS)
      return;

    // Upgrade old-style contents.rdf Chrome Manifests if necessary.
    if (this._type == Ci.nsIUpdateItem.TYPE_THEME)
      this.upgradeThemeChrome();
    else
      this.upgradeExtensionChrome();

    // Add metadata for the extension to the global extension metadata set
    this._ds.addItemMetadata(this._id, this.metadataDS, this._installLocation);
  },

  /**
   * Safely extract the Extension's files into the target folder.
   * @param   file
   *          The XPI/JAR file to install from.
   */
  _installExtensionFiles: function Installer__installExtensionFiles(file) {
    /**
      * Callback for |safeInstallOperation| that performs file level installation
      * steps for an Extension.
      * @param   extensionID
      *          The GUID of the Extension being installed.
      * @param   installLocation
      *          The Install Location where the Extension is being installed.
      * @param   xpiFile
      *          The source XPI file that contains the Extension.
      */
    function extractExtensionFiles(extensionID, installLocation, xpiFile) {
      // Create a logger to log install operations for uninstall. This must be
      // created in the |safeInstallOperation| callback, since it creates a file
      // in the target directory. If we do this outside of the callback, we may
      // be clobbering a file we should not be.
      var zipReader = getZipReaderForFile(xpiFile);

      // create directories first
      var entries = zipReader.findEntries("*/");
      while (entries.hasMore()) {
        var entryName = entries.getNext();
        var target = installLocation.getItemFile(extensionID, entryName);
        if (!target.exists()) {
          try {
            target.create(Ci.nsILocalFile.DIRECTORY_TYPE, PERMS_DIRECTORY);
          }
          catch (e) {
            ERROR("extractExtensionsFiles: failed to create target directory for extraction " +
                  " file = " + target.path + ", exception = " + e + "\n");
          }
        }
      }

      entries = zipReader.findEntries(null);
      while (entries.hasMore()) {
        var entryName = entries.getNext();
        target = installLocation.getItemFile(extensionID, entryName);
        if (target.exists())
          continue;

        try {
          target.create(Ci.nsILocalFile.NORMAL_FILE_TYPE, PERMS_FILE);
        }
        catch (e) {
          ERROR("extractExtensionsFiles: failed to create target file for extraction " +
                " file = " + target.path + ", exception = " + e + "\n");
        }
        zipReader.extract(entryName, target);
      }
      zipReader.close();
    }

    /**
      * Callback for |safeInstallOperation| that performs file level installation
      * steps for a Theme.
      * @param   id
      *          The GUID of the Theme being installed.
      * @param   installLocation
      *          The Install Location where the Theme is being installed.
      * @param   jarFile
      *          The source JAR file that contains the Theme.
      */
    function extractThemeFiles(id, installLocation, jarFile) {
      var themeDirectory = installLocation.getItemLocation(id);
      var zipReader = getZipReaderForFile(jarFile);

      // The only critical file is the install.rdf and we would not have
      // gotten this far without one.
      var rootFiles = [FILE_INSTALL_MANIFEST, FILE_CHROME_MANIFEST,
                       "preview.png", "icon.png"];
      for (var i = 0; i < rootFiles.length; ++i) {
        try {
          var target = installLocation.getItemFile(id, rootFiles[i]);
          zipReader.extract(rootFiles[i], target);
        }
        catch (e) {
        }
      }

      var manifestFile = installLocation.getItemFile(id, FILE_CHROME_MANIFEST);
      // new theme structure requires a chrome.manifest file
      if (manifestFile.exists()) {
        var entries = zipReader.findEntries(DIR_CHROME + "/*");
        while (entries.hasMore()) {
          var entryName = entries.getNext();
          if (entryName.charAt(entryName.length - 1) == "/")
            continue;
          target = installLocation.getItemFile(id, entryName);
          try {
            target.create(Ci.nsILocalFile.NORMAL_FILE_TYPE, PERMS_FILE);
          }
          catch (e) {
            ERROR("extractThemeFiles: failed to create target file for extraction " +
                  " file = " + target.path + ", exception = " + e + "\n");
          }
          zipReader.extract(entryName, target);
        }
        zipReader.close();
      }
      else { // old theme structure requires only an install.rdf
        try {
          var contentsManifestFile = installLocation.getItemFile(id, FILE_CONTENTS_MANIFEST);
          contentsManifestFile.create(Ci.nsILocalFile.NORMAL_FILE_TYPE, PERMS_FILE);
          zipReader.extract(FILE_CONTENTS_MANIFEST, contentsManifestFile);
        }
        catch (e) {
          zipReader.close();
          ERROR("extractThemeFiles: failed to extract contents.rdf: " + target.path);
          throw e; // let the safe-op clean up
        }
        zipReader.close();
        var chromeDir = installLocation.getItemFile(id, DIR_CHROME);
        try {
          jarFile.copyTo(chromeDir, jarFile.leafName);
        }
        catch (e) {
          ERROR("extractThemeFiles: failed to copy theme JAR file to: " + chromeDir.path);
          throw e; // let the safe-op clean up
        }

        if (!installer.metadataDS && installer._type == Ci.nsIUpdateItem.TYPE_THEME) {
          var themeName = extensionStrings.GetStringFromName("incompatibleThemeName");
          if (contentsManifestFile && contentsManifestFile.exists()) {
            var contentsManifest = gRDF.GetDataSourceBlocking(getURLSpecFromFile(contentsManifestFile));
            try {
              var ctr = getContainer(contentsManifest,
                                     gRDF.GetResource("urn:mozilla:skin:root"));
              var elts = ctr.GetElements();
              var nameArc = gRDF.GetResource(CHROME_NS("displayName"));
              while (elts.hasMoreElements()) {
                var elt = elts.getNext().QueryInterface(Ci.nsIRDFResource);
                themeName = stringData(contentsManifest.GetTarget(elt, nameArc, true));
                if (themeName)
                  break;
              }
            }
            catch (e) {
              themeName = extensionStrings.GetStringFromName("incompatibleThemeName");
            }
          }
          showIncompatibleError({ name: themeName, version: "",
                                  type: Ci.nsIUpdateItem.TYPE_THEME });
          LOG("Theme JAR file: " + jarFile.leafName + " contains an Old-Style " +
              "Theme that is not compatible with this version of the software.");
          throw new Error("Old Theme"); // let the safe-op clean up
        }
      }
    }

    var installer = this;
    var callback = extractExtensionFiles;
    if (this._type == Ci.nsIUpdateItem.TYPE_THEME)
      callback = extractThemeFiles;
    safeInstallOperation(this._id, this._installLocation,
                          { callback: callback, data: file });
  },

  /**
   * Upgrade contents.rdf Chrome Manifests used by this Theme to the new
   * chrome.manifest format if necessary.
   */
  upgradeThemeChrome: function Installer_upgradeThemeChrome() {
    // Use the Chrome Registry API to install the theme there
    var cr = Cc["@mozilla.org/chrome/chrome-registry;1"].
             getService(Ci.nsIToolkitChromeRegistry);
    var manifestFile = this._installLocation.getItemFile(this._id, FILE_CHROME_MANIFEST);
    if (manifestFile.exists() ||
        this._id == stripPrefix(RDFURI_DEFAULT_THEME, PREFIX_ITEM_URI))
      return;

    try {
      // creates a chrome manifest for themes
      var manifestURI = getURIFromFile(manifestFile);
      var chromeDir = this._installLocation.getItemFile(this._id, DIR_CHROME);
      // We're relying on the fact that there is only one JAR file
      // in the "chrome" directory. This is a hack, but it works.
      var entries = chromeDir.directoryEntries.QueryInterface(Ci.nsIDirectoryEnumerator);
      var jarFile = entries.nextFile;
      if (jarFile) {
        var jarFileURI = getURIFromFile(jarFile);
        var contentsURI = newURI("jar:" + jarFileURI.spec + "!/");
        var contentsFile = this._installLocation.getItemFile(this._id, FILE_CONTENTS_MANIFEST);
        var contentsFileURI = getURIFromFile(contentsFile.parent);

        cr.processContentsManifest(contentsFileURI, manifestURI, contentsURI, false, true);
      }
      entries.close();
      contentsFile.remove(false);
    }
    catch (e) {
      // Failed to register chrome, for any number of reasons - non-existent
      // contents.rdf file at the location specified, malformed contents.rdf,
      // etc. Set the pending op to be OP_NEEDS_UNINSTALL so that the
      // extension is uninstalled properly during the subsequent uninstall
      // pass in |ExtensionManager::_finishOperations|
      ERROR("upgradeThemeChrome: failed for theme " + this._id + " - why " +
            "not convert to the new chrome.manifest format while you're at it? " +
            "Failure exception: " + e);
      showMessage("malformedRegistrationTitle", [], "malformedRegistrationMessage",
                  [BundleManager.appName]);

      var stageFile = this._installLocation.getStageFile(this._id);
      if (stageFile)
        this._installLocation.removeFile(stageFile);

      StartupCache.put(this._installLocation, this._id, OP_NEEDS_UNINSTALL, true);
      StartupCache.write();
    }
  },

  /**
   * Upgrade contents.rdf Chrome Manifests used by this Extension to the new
   * chrome.manifest format if necessary.
   */
  upgradeExtensionChrome: function Installer_upgradeExtensionChrome() {
    // If the extension is aware of the new flat chrome manifests and has
    // included one, just use it instead of generating one from the
    // install.rdf/contents.rdf data.
    var manifestFile = this._installLocation.getItemFile(this._id, FILE_CHROME_MANIFEST);
    if (manifestFile.exists())
      return;

    try {
      // Enumerate the metadata datasource files collection and register chrome
      // for each file, calling _registerChrome for each.
      var chromeDir = this._installLocation.getItemFile(this._id, DIR_CHROME);

      if (!manifestFile.parent.exists())
        return;

      // Even if an extension doesn't have any chrome, we generate an empty
      // manifest file so that we don't try to upgrade from the "old-style"
      // chrome manifests at every startup.
      manifestFile.create(Ci.nsILocalFile.NORMAL_FILE_TYPE, PERMS_FILE);

      var manifestURI = getURIFromFile(manifestFile);
      var files = this.metadataDS.GetTargets(gInstallManifestRoot, EM_R("file"), true);
      while (files.hasMoreElements()) {
        var file = files.getNext().QueryInterface(Ci.nsIRDFResource);
        var chromeFile = chromeDir.clone();
        var fileName = file.Value.substr("urn:mozilla:extension:file:".length, file.Value.length);
        chromeFile.append(fileName);

        var fileURLSpec = getURLSpecFromFile(chromeFile);
        if (!chromeFile.isDirectory()) {
          var zipReader = getZipReaderForFile(chromeFile);
          fileURLSpec = "jar:" + fileURLSpec + "!/";
          var contentsFile = this._installLocation.getItemFile(this._id, FILE_CONTENTS_MANIFEST);
          contentsFile.create(Ci.nsILocalFile.NORMAL_FILE_TYPE, PERMS_FILE);
        }

        var providers = [EM_R("package"), EM_R("skin"), EM_R("locale")];
        for (var i = 0; i < providers.length; ++i) {
          var items = this.metadataDS.GetTargets(file, providers[i], true);
          while (items.hasMoreElements()) {
            var item = items.getNext().QueryInterface(Ci.nsIRDFLiteral);
            var fileURI = newURI(fileURLSpec + item.Value);
            // Extract the contents.rdf files instead of opening them inside of
            // the jar. This prevents the jar from being cached by the zip
            // reader which will keep the jar in use and prevent deletion.
            if (zipReader) {
              zipReader.extract(item.Value + FILE_CONTENTS_MANIFEST, contentsFile);
              var contentsFileURI = getURIFromFile(contentsFile.parent);
            }
            else
              contentsFileURI = fileURI;

            var cr = Cc["@mozilla.org/chrome/chrome-registry;1"].
                     getService(Ci.nsIToolkitChromeRegistry);
            cr.processContentsManifest(contentsFileURI, manifestURI, fileURI, true, false);
          }
        }
        if (zipReader) {
          zipReader.close();
          zipReader = null;
          contentsFile.remove(false);
        }
      }
    }
    catch (e) {
      // Failed to register chrome, for any number of reasons - non-existent
      // contents.rdf file at the location specified, malformed contents.rdf,
      // etc. Set the pending op to be OP_NEEDS_UNINSTALL so that the
      // extension is uninstalled properly during the subsequent uninstall
      // pass in |ExtensionManager::_finishOperations|
      ERROR("upgradeExtensionChrome: failed for extension " + this._id + " - why " +
            "not convert to the new chrome.manifest format while you're at it? " +
            "Failure exception: " + e);
      showMessage("malformedRegistrationTitle", [], "malformedRegistrationMessage",
                  [BundleManager.appName]);

      var stageFile = this._installLocation.getStageFile(this._id);
      if (stageFile)
        this._installLocation.removeFile(stageFile);

      StartupCache.put(this._installLocation, this._id, OP_NEEDS_UNINSTALL, true);
      StartupCache.write();
    }
  }
};

/**
 * Safely attempt to perform a caller-defined install operation for a given
 * item ID. Using aggressive success-safety checks, this function will attempt
 * to move an existing location for an item aside and then allow installation
 * into the appropriate folder. If any operation fails the installation will
 * abort and roll back from the moved-aside old version.
 * @param   itemID
 *          The GUID of the item to perform the operation on.
 * @param   installLocation
 *          The Install Location where the item is installed.
 * @param   installCallback
 *          A caller supplied JS object with the following properties:
 *          "data"      A data parameter to be passed to the callback.
 *          "callback"  A function to perform the install operation. This
 *                      function is passed three parameters:
 *                      1. The GUID of the item being operated on.
 *                      2. The Install Location where the item is installed.
 *                      3. The "data" parameter on the installCallback object.
 */
function safeInstallOperation(itemID, installLocation, installCallback) {
  var movedFiles = [];

  /**
   * Reverts a deep move by moving backed up files back to their original
   * location.
   */
  function rollbackMove()
  {
    for (var i = 0; i < movedFiles.length; ++i) {
      var oldFile = movedFiles[i].oldFile;
      var newFile = movedFiles[i].newFile;
      try {
        newFile.moveTo(oldFile.parent, newFile.leafName);
      }
      catch (e) {
        ERROR("safeInstallOperation: failed to roll back files after an install " +
              "operation failed. Failed to roll back: " + newFile.path + " to: " +
              oldFile.path + " ... aborting installation.");
        throw e;
      }
    }
  }

  /**
   * Moves a file to a new folder.
   * @param   file
   *          The file to move
   * @param   destination
   *          The target folder
   */
  function moveFile(file, destination) {
    try {
      var oldFile = file.clone();
      file.moveTo(destination, file.leafName);
      movedFiles.push({ oldFile: oldFile, newFile: file });
    }
    catch (e) {
      ERROR("safeInstallOperation: failed to back up file: " + file.path + " to: " +
            destination.path + " ... rolling back file moves and aborting " +
            "installation.");
      rollbackMove();
      throw e;
    }
  }

  /**
   * Moves a directory to a new location. If any part of the move fails,
   * files already moved will be rolled back.
   * @param   sourceDir
   *          The directory to move
   * @param   targetDir
   *          The destination directory
   * @param   currentDir
   *          The current directory (a subdirectory of |sourceDir| or
   *          |sourceDir| itself) we are moving files from.
   */
  function moveDirectory(sourceDir, targetDir, currentDir) {
    var entries = currentDir.directoryEntries.QueryInterface(Ci.nsIDirectoryEnumerator);
    while (true) {
      var entry = entries.nextFile;
      if (!entry)
        break;
      if (entry.isDirectory())
        moveDirectory(sourceDir, targetDir, entry);
      else if (entry instanceof Ci.nsILocalFile) {
        var rd = entry.getRelativeDescriptor(sourceDir);
        var destination = targetDir.clone().QueryInterface(Ci.nsILocalFile);
        destination.setRelativeDescriptor(targetDir, rd);
        moveFile(entry, destination.parent);
      }
    }
    entries.close();
  }

  /**
   * Removes the temporary backup directory where we stored files.
   * @param   directory
   *          The backup directory to remove
   */
  function cleanUpTrash(directory) {
    try {
      // Us-generated. Safe.
      if (directory && directory.exists())
        removeDirRecursive(directory);
    }
    catch (e) {
      ERROR("safeInstallOperation: failed to clean up the temporary backup of the " +
            "older version: " + itemLocationTrash.path);
      // This is a non-fatal error. Annoying, but non-fatal.
    }
  }

  if (!installLocation.itemIsManagedIndependently(itemID)) {
    var itemLocation = installLocation.getItemLocation(itemID);
    if (itemLocation.exists()) {
      var trashDirName = itemID + "-trash";
      var itemLocationTrash = itemLocation.parent.clone();
      itemLocationTrash.append(trashDirName);
      if (itemLocationTrash.exists()) {
        // We can remove recursively here since this is a folder we created, not
        // one the user specified. If this fails, it'll throw, and the caller
        // should stop installation.
        try {
          removeDirRecursive(itemLocationTrash);
        }
        catch (e) {
          ERROR("safeFileOperation: failed to remove existing trash directory " +
                itemLocationTrash.path + " ... aborting installation.");
          throw e;
        }
      }

      // Move the directory that contains the existing version of the item aside,
      // into {GUID}-trash. This will throw if there's a failure and the install
      // will abort.
      moveDirectory(itemLocation, itemLocationTrash, itemLocation);

      // Clean up the original location, if necessary. Again, this is a path we
      // generated, so it is safe to recursively delete.
      try {
        removeDirRecursive(itemLocation);
      }
      catch (e) {
        ERROR("safeInstallOperation: failed to clean up item location after its contents " +
              "were properly backed up. Failed to clean up: " + itemLocation.path +
              " ... rolling back file moves and aborting installation.");
        rollbackMove();
        cleanUpTrash(itemLocationTrash);
        throw e;
      }
    }
  }
  else if (installLocation.name == KEY_APP_PROFILE ||
           installLocation.name == KEY_APP_GLOBAL ||
           installLocation.name == KEY_APP_SYSTEM_USER) {
    // Check for a pointer file and move it aside if it exists
    var pointerFile = installLocation.location.clone();
    pointerFile.append(itemID);
    if (pointerFile.exists() && !pointerFile.isDirectory()) {
      var trashFileName = itemID + "-trash";
      var itemLocationTrash = installLocation.location.clone();
      itemLocationTrash.append(trashFileName);
      if (itemLocationTrash.exists()) {
        // We can remove recursively here since this is a folder we created, not
        // one the user specified. If this fails, it'll throw, and the caller
        // should stop installation.
        try {
          removeDirRecursive(itemLocationTrash);
        }
        catch (e) {
          ERROR("safeFileOperation: failed to remove existing trash directory " +
                itemLocationTrash.path + " ... aborting installation.");
          throw e;
        }
      }
      itemLocationTrash.create(Ci.nsILocalFile.DIRECTORY_TYPE, PERMS_DIRECTORY);
      // Move the pointer file to the trash.
      moveFile(pointerFile, itemLocationTrash);
    }
  }

  // Now tell the client to do their stuff.
  try {
    installCallback.callback(itemID, installLocation, installCallback.data);
  }
  catch (e) {
    // This means the install operation failed. Remove everything and roll back.
    ERROR("safeInstallOperation: install operation (caller-supplied callback) failed, " +
          "rolling back file moves and aborting installation.");
    try {
      // Us-generated. Safe.
      removeDirRecursive(itemLocation);
    }
    catch (e) {
      ERROR("safeInstallOperation: failed to remove the folder we failed to install " +
            "an item into: " + itemLocation.path + " -- There is not much to suggest " +
            "here... maybe restart and try again?");
      cleanUpTrash(itemLocationTrash);
      throw e;
    }
    rollbackMove();
    cleanUpTrash(itemLocationTrash);
    throw e;
  }

  // Now, and only now - after everything else has succeeded (against all odds!)
  // remove the {GUID}-trash directory where we stashed the old version of the
  // item.
  cleanUpTrash(itemLocationTrash);
}

/**
 * Manages the list of pending operations.
 */
var PendingOperations = {
  _ops: { },

  /**
   * Adds an entry to the Pending Operations List
   * @param   opType
   *          The type of Operation to be performed
   * @param   entry
   *          A JS Object representing the item to be operated on:
   *          "locationKey"   The name of the Install Location where the item
   *                          is installed.
   *          "id"            The GUID of the item.
   */
  addItem: function PendingOperations_addItem(opType, entry) {
    if (opType == OP_NONE)
      this.clearOpsForItem(entry.id);
    else {
      if (!(opType in this._ops))
        this._ops[opType] = { };
      this._ops[opType][entry.id] = entry.locationKey;
    }
  },

  /**
   * Removes a Pending Operation from the list
   * @param   opType
   *          The type of Operation being removed
   * @param   id
   *          The GUID of the item to remove the entry for
   */
  clearItem: function PendingOperations_clearItem(opType, id) {
    if (opType in this._ops && id in this._ops[opType])
      delete this._ops[opType][id];
  },

  /**
   * Removes all Pending Operation for an item
   * @param   id
   *          The ID of the item to remove the entries for
   */
  clearOpsForItem: function PendingOperations_clearOpsForItem(id) {
    for (var opType in this._ops) {
      if (id in this._ops[opType])
        delete this._ops[opType][id];
    }
  },

  /**
   * Remove all Pending Operations of a certain type
   * @param   opType
   *          The type of Operation to remove all entries for
   */
  clearItems: function PendingOperations_clearItems(opType) {
    if (opType in this._ops)
      delete this._ops[opType];
  },

  /**
   * Get an array of operations of a certain type
   * @param   opType
   *          The type of Operation to return a list of
   */
  getOperations: function PendingOperations_getOperations(opType) {
    if (!(opType in this._ops))
      return [];
    var ops = [];
    for (var id in this._ops[opType])
      ops.push( {id: id, locationKey: this._ops[opType][id] } );
    return ops;
  },

  /**
   * The total number of Pending Operations, for all types.
   */
  get size() {
    var size = 0;
    for (var opType in this._ops) {
      for (var id in this._ops[opType])
        ++size;
    }
    return size;
  }
};

/**
 * Manages registered Install Locations
 */
var InstallLocations = {
  _locations: { },

  /**
   * A nsISimpleEnumerator of all available Install Locations.
   */
  get enumeration() {
    var installLocations = [];
    for (var key in this._locations)
      installLocations.push(InstallLocations.get(key));
    return new ArrayEnumerator(installLocations);
  },

  /**
   * Gets a named Install Location
   * @param   name
   *          The name of the Install Location to get
   */
  get: function InstallLocations_get(name) {
    return name in this._locations ? this._locations[name] : null;
  },

  /**
   * Registers an Install Location
   * @param   installLocation
   *          The Install Location to register
   */
  put: function InstallLocations_put(installLocation) {
    this._locations[installLocation.name] = installLocation;
  }
};

/**
 * Manages the Startup Cache. The Startup Cache is a representation
 * of the contents of extensions.cache, a list of all
 * items the Extension System knows about, whether or not they
 * are active or visible.
 */
var StartupCache = {
  /**
   * Location Name -> GUID hash of entries from the Startup Cache file
   * Each entry has the following properties:
   *  "descriptor"    The location on disk of the item
   *  "mtime"         The time the location was last modified
   *  "op"            Any pending operations on this item.
   *  "location"      The Install Location name where the item is installed.
   */
  entries: { },

  /**
   * Puts an entry into the Startup Cache
   * @param   installLocation
   *          The Install Location where the item is installed
   * @param   id
   *          The GUID of the item
   * @param   op
   *          The name of the operation to be performed
   * @param   shouldCreate
   *          Whether or not we should create a new entry for this item
   *          in the cache if one does not already exist.
   */
  put: function StartupCache_put(installLocation, id, op, shouldCreate) {
    var itemLocation = installLocation.getItemLocation(id);

    var descriptor = null;
    var mtime = null;
    if (itemLocation) {
      itemLocation.QueryInterface(Ci.nsILocalFile);
      descriptor = getDescriptorFromFile(itemLocation, installLocation);
      if (itemLocation.exists() && itemLocation.isDirectory())
        mtime = Math.floor(itemLocation.lastModifiedTime / 1000);
    }

    this._putRaw(installLocation.name, id, descriptor, mtime, op, shouldCreate);
  },

  /**
   * Private helper function for putting an entry into the Startup Cache
   * without relying on the presence of its associated nsIInstallLocation
   * instance.
   *
   * @param key
   *        The install location name.
   * @param id
   *        The ID of the item.
   * @param descriptor
   *        Value returned from absoluteDescriptor.  May be null, in which
   *        case the descriptor field is not updated.
   * @param mtime
   *        The last modified time of the item.  May be null, in which case the
   *        descriptor field is not updated.
   * @param op
   *        The OP code to store with the entry.
   * @param shouldCreate
   *        Boolean value indicating whether to create or delete the entry.
   */
  _putRaw: function StartupCache__putRaw(key, id, descriptor, mtime, op, shouldCreate) {
    if (!(key in this.entries))
      this.entries[key] = { };
    if (!(id in this.entries[key]))
      this.entries[key][id] = { };
    if (shouldCreate) {
      if (!this.entries[key][id])
        this.entries[key][id] = { };

      var entry = this.entries[key][id];

      if (descriptor)
        entry.descriptor = descriptor;
      if (mtime)
        entry.mtime = mtime;
      entry.op = op;
      entry.location = key;
    }
    else
      this.entries[key][id] = null;
  },

  /**
   * Clears an entry from the Startup Cache
   * @param   installLocation
   *          The Install Location where item is installed
   * @param   id
   *          The GUID of the item.
   */
  clearEntry: function StartupCache_clearEntry(installLocation, id) {
    var key = installLocation.name;
    if (key in this.entries && id in this.entries[key])
      this.entries[key][id] = null;
  },

  /**
   * Get all the startup cache entries for a particular ID.
   * @param   id
   *          The GUID of the item to locate.
   * @returns An array of Startup Cache entries for the specified ID.
   */
  findEntries: function StartupCache_findEntries(id) {
    var entries = [];
    for (var key in this.entries) {
      if (id in this.entries[key])
        entries.push(this.entries[key][id]);
    }
    return entries;
  },

  /**
   * Read the Item-Change manifest file into a hash of properties.
   * The Item-Change manifest currently holds a list of paths, with the last
   * mtime for each path, and the GUID of the item at that path.
   */
  read: function StartupCache_read() {
    var itemChangeManifest = getFile(KEY_PROFILEDIR, [FILE_EXTENSIONS_STARTUP_CACHE]);
    if (!itemChangeManifest.exists()) {
      // There is no change manifest for some reason, either we're in an initial
      // state or something went wrong with one of the other files and the
      // change manifest was removed. Return an empty dataset and rebuild.
      gFirstRun = true;
      return;
    }
    var fis = Cc["@mozilla.org/network/file-input-stream;1"].
              createInstance(Ci.nsIFileInputStream);
    fis.init(itemChangeManifest, -1, -1, false);
    if (fis instanceof Ci.nsILineInputStream) {
      var line = { value: "" };
      var more = false;
      do {
        more = fis.readLine(line);
        if (line.value) {
          // The Item-Change manifest is formatted like so:
          //  (pd = descriptor)
          // location-key\tguid-of-item\tpd-to-extension1\tmtime-of-pd\tpending-op
          // location-key\tguid-of-item\tpd-to-extension2\tmtime-of-pd\tpending-op
          // ...
          // We hash on location-key first, because we don't want to have to
          // spin up the main extensions datasource on every start to determine
          // the Install Location for an item.
          // We hash on guid second, because we want a way to quickly determine
          // item GUID during a check loop that runs on every startup.
          var parts = line.value.split("\t");
          // Silently drop any entries in unknown install locations
          if (!InstallLocations.get(parts[0]))
            continue;
          var op = parts[4];
          this._putRaw(parts[0], parts[1], parts[2], parts[3], op, true);
          if (op)
            PendingOperations.addItem(op, { locationKey: parts[0], id: parts[1] });
        }
      }
      while (more);
    }
    fis.close();
  },

  /**
   * Writes the Startup Cache to disk
   */
  write: function StartupCache_write() {
    var extensionsCacheFile = getFile(KEY_PROFILEDIR, [FILE_EXTENSIONS_STARTUP_CACHE]);
    var fos = openSafeFileOutputStream(extensionsCacheFile);
    for (var locationKey in this.entries) {
      for (var id in this.entries[locationKey]) {
        var entry = this.entries[locationKey][id];
        if (entry) {
          try {
            var itemLocation = getFileFromDescriptor(entry.descriptor, InstallLocations.get(locationKey));

            // Update our knowledge of this item's last-modified-time.
            // XXXdarin: this may cause us to miss changes in some cases.
            var itemMTime = 0;
            if (itemLocation.exists() && itemLocation.isDirectory())
              itemMTime = Math.floor(itemLocation.lastModifiedTime / 1000);

            // Each line in the startup cache manifest is in this form:
            // location-key\tid-of-item\tpd-to-extension1\tmtime-of-pd\tpending-op
            var line = locationKey + "\t" + id + "\t" + entry.descriptor + "\t" +
                       itemMTime + "\t" + entry.op + "\r\n";
            fos.write(line, line.length);
          }
          catch (e) {}
        }
      }
    }
    closeSafeFileOutputStream(fos);
  }
};

/**
 * Installs, manages and tracks compatibility for Extensions and Themes
 * @constructor
 */
function ExtensionManager() {
  gApp = Cc["@mozilla.org/xre/app-info;1"].
         getService(Ci.nsIXULAppInfo).QueryInterface(Ci.nsIXULRuntime);
  gOSTarget = gApp.OS;
  try {
    gXPCOMABI = gApp.XPCOMABI;
  } catch (ex) {
    // Provide a default for gXPCOMABI. It won't be compared to an
    // item's metadata (i.e. install.rdf can't specify e.g. WINNT_unknownABI
    // as targetPlatform), but it will be displayed in error messages and
    // transmitted to update URLs.
    gXPCOMABI = UNKNOWN_XPCOM_ABI;
  }
  gPref = Cc["@mozilla.org/preferences-service;1"].
          getService(Ci.nsIPrefBranch2);

  gOS = Cc["@mozilla.org/observer-service;1"].
        getService(Ci.nsIObserverService);
  gOS.addObserver(this, "xpcom-shutdown", false);

  gConsole = Cc["@mozilla.org/consoleservice;1"].
             getService(Ci.nsIConsoleService);

  gRDF = Cc["@mozilla.org/rdf/rdf-service;1"].
         getService(Ci.nsIRDFService);
  gInstallManifestRoot = gRDF.GetResource(RDFURI_INSTALL_MANIFEST_ROOT);

  // Register Global Install Location
  var appGlobalExtensions = getDirNoCreate(KEY_APPDIR, [DIR_EXTENSIONS]);
  var priority = Ci.nsIInstallLocation.PRIORITY_APP_SYSTEM_GLOBAL;
  var globalLocation = new DirectoryInstallLocation(KEY_APP_GLOBAL,
                                                    appGlobalExtensions, true,
                                                    priority, false);
  InstallLocations.put(globalLocation);

  // Register App-Profile Install Location
  var appProfileExtensions = getDirNoCreate(KEY_PROFILEDS, [DIR_EXTENSIONS]);
  var priority = Ci.nsIInstallLocation.PRIORITY_APP_PROFILE;
  var profileLocation = new DirectoryInstallLocation(KEY_APP_PROFILE,
                                                     appProfileExtensions, false,
                                                     priority, false);
  InstallLocations.put(profileLocation);

  // Register per-user Install Location
  try {
    var appSystemUExtensions = getDirNoCreate("XREUSysExt", [gApp.ID]);
  }
  catch(e) { }

  if (appSystemUExtensions) {
    var priority = Ci.nsIInstallLocation.PRIORITY_APP_SYSTEM_USER;
    var systemLocation = new DirectoryInstallLocation(KEY_APP_SYSTEM_USER,
                                                      appSystemUExtensions, false,
                                                      priority, true);

    InstallLocations.put(systemLocation);
  }

  // Register App-System-Shared Install Location
  try {
    var appSystemSExtensions = getDirNoCreate("XRESysSExtPD", [gApp.ID]);
  }
  catch (e) { }

  if (appSystemSExtensions) {
    var priority = Ci.nsIInstallLocation.PRIORITY_APP_SYSTEM_GLOBAL + 10;
    var systemLocation = new DirectoryInstallLocation(KEY_APP_SYSTEM_SHARE,
                                                      appSystemSExtensions, true,
                                                      priority, true);
    InstallLocations.put(systemLocation);
  }

  // Register App-System-Local Install Location
  try {
    var appSystemLExtensions = getDirNoCreate("XRESysLExtPD", [gApp.ID]);
  }
  catch (e) { }

  if (appSystemLExtensions) {
    var priority = Ci.nsIInstallLocation.PRIORITY_APP_SYSTEM_GLOBAL + 20;
    var systemLocation = new DirectoryInstallLocation(KEY_APP_SYSTEM_LOCAL,
                                                      appSystemLExtensions, true,
                                                      priority, true);
    InstallLocations.put(systemLocation);
  }

//@line 2498 "e:\builds\moz2_slave\mozilla-1.9.1-win32-xulrunner\build\toolkit\mozapps\extensions\src\nsExtensionManager.js.in"
  // Register HKEY_LOCAL_MACHINE Install Location
  InstallLocations.put(
      new WinRegInstallLocation("winreg-app-global",
                                nsIWindowsRegKey.ROOT_KEY_LOCAL_MACHINE,
                                true,
                                Ci.nsIInstallLocation.PRIORITY_APP_SYSTEM_GLOBAL + 10));

  // Register HKEY_CURRENT_USER Install Location
  InstallLocations.put(
      new WinRegInstallLocation("winreg-app-user",
                                nsIWindowsRegKey.ROOT_KEY_CURRENT_USER,
                                false,
                                Ci.nsIInstallLocation.PRIORITY_APP_SYSTEM_USER + 10));
//@line 2512 "e:\builds\moz2_slave\mozilla-1.9.1-win32-xulrunner\build\toolkit\mozapps\extensions\src\nsExtensionManager.js.in"

  // Register Additional Install Locations
  var categoryManager = Cc["@mozilla.org/categorymanager;1"].
                        getService(Ci.nsICategoryManager);
  var locations = categoryManager.enumerateCategory(CATEGORY_INSTALL_LOCATIONS);
  while (locations.hasMoreElements()) {
    var entry = locations.getNext().QueryInterface(Ci.nsISupportsCString).data;
    var contractID = categoryManager.getCategoryEntry(CATEGORY_INSTALL_LOCATIONS, entry);
    var location = Cc[contractID].getService(Ci.nsIInstallLocation);
    InstallLocations.put(location);
  }
}

ExtensionManager.prototype = {
  /**
   * See nsIObserver.idl
   */
  observe: function EM_observe(subject, topic, data) {
    switch (topic) {
    case "profile-after-change":
      this._profileSelected();
      break;
    case "quit-application-requested":
      this._confirmCancelDownloadsOnQuit(subject);
      break;
    case "offline-requested":
      this._confirmCancelDownloadsOnOffline(subject);
      break;
    case "xpcom-shutdown":
      this._shutdown();
      break;
    case "nsPref:changed":
      if (data == PREF_EM_LOGGING_ENABLED)
        this._loggingToggled();
      else if (data == PREF_EM_CHECK_COMPATIBILITY ||
               data == PREF_EM_CHECK_UPDATE_SECURITY)
        this._updateAppDisabledState();
      else if ((data == PREF_MATCH_OS_LOCALE) || (data == PREF_SELECTED_LOCALE))
        this._updateLocale();
      break;
    }
  },

  /**
   * Refresh the logging enabled global from preferences when the user changes
   * the preference settting.
   */
  _loggingToggled: function EM__loggingToggled() {
    gLoggingEnabled = getPref("getBoolPref", PREF_EM_LOGGING_ENABLED, false);
  },

  /**
   * Retrieves the current locale
   */
  _updateLocale: function EM__updateLocale() {
    try {
      if (gPref.getBoolPref(PREF_MATCH_OS_LOCALE)) {
        var localeSvc = Cc["@mozilla.org/intl/nslocaleservice;1"].
                        getService(Ci.nsILocaleService);
        gLocale = localeSvc.getLocaleComponentForUserAgent();
        return;
      }
    }
    catch (ex) {
    }
    gLocale = gPref.getCharPref(PREF_SELECTED_LOCALE);
  },

  /**
   * When a preference is toggled that affects whether an item is usable or not
   * we must app-enable or app-disable the item based on the new settings.
   */
  _updateAppDisabledState: function EM__updateAppDisabledState() {
    gCheckCompatibility = getPref("getBoolPref", PREF_EM_CHECK_COMPATIBILITY, true);
    gCheckUpdateSecurity = getPref("getBoolPref", PREF_EM_CHECK_UPDATE_SECURITY, true);
    var ds = this.datasource;

    // Enumerate all items
    var ctr = getContainer(ds, ds._itemRoot);
    var elements = ctr.GetElements();
    while (elements.hasMoreElements()) {
      var itemResource = elements.getNext().QueryInterface(Ci.nsIRDFResource);

      // App disable or enable items as necessary
      // _appEnableItem and _appDisableItem will do nothing if the item is already
      // in the right state.
      id = stripPrefix(itemResource.Value, PREFIX_ITEM_URI);
      if (this._isUsableItem(id))
        this._appEnableItem(id);
      else
        this._appDisableItem(id);
    }
  },

  /**
   * Initialize the system after a profile has been selected.
   */
  _profileSelected: function EM__profileSelected() {
    // Tell the Chrome Registry which Skin to select
    try {
      if (gPref.getBoolPref(PREF_DSS_SWITCHPENDING)) {
        var toSelect = gPref.getCharPref(PREF_DSS_SKIN_TO_SELECT);
        gPref.setCharPref(PREF_GENERAL_SKINS_SELECTEDSKIN, toSelect);
        gPref.clearUserPref(PREF_DSS_SWITCHPENDING);
        gPref.clearUserPref(PREF_DSS_SKIN_TO_SELECT);
      }
    }
    catch (e) {
    }

    if ("nsICrashReporter" in Ci && gApp instanceof Ci.nsICrashReporter) {
      // Annotate the crash report with the list of add-ons
      try {
        try {
          gApp.annotateCrashReport("Add-ons", gPref.getCharPref(PREF_EM_ENABLED_ITEMS));
        } catch (e) { }
        gApp.annotateCrashReport("Theme", gPref.getCharPref(PREF_GENERAL_SKINS_SELECTEDSKIN));
      }
      catch (ex) {
        // This will fail in unnofficial builds, ignorable error
      }
    }

    gLoggingEnabled = getPref("getBoolPref", PREF_EM_LOGGING_ENABLED, false);
    gCheckCompatibility = getPref("getBoolPref", PREF_EM_CHECK_COMPATIBILITY, true);
    gCheckUpdateSecurity = getPref("getBoolPref", PREF_EM_CHECK_UPDATE_SECURITY, true);
    gPref.addObserver("extensions.", this, false);
    gPref.addObserver(PREF_MATCH_OS_LOCALE, this, false);
    gPref.addObserver(PREF_SELECTED_LOCALE, this, false);
    this._updateLocale();
  },

  /**
   * Notify user that there are new addons updates
   */
  _showUpdatesWindow: function EM__showUpdatesWindow() {
    if (!getPref("getBoolPref", PREF_UPDATE_NOTIFYUSER, false))
      return;

    const EMURL = "chrome://mozapps/content/extensions/extensions.xul";
    const EMFEATURES = "chrome,centerscreen,extra-chrome,dialog,resizable,modal";

    var ww = Cc["@mozilla.org/embedcomp/window-watcher;1"].
             getService(Ci.nsIWindowWatcher);
    var param = Cc["@mozilla.org/supports-array;1"].
                createInstance(Ci.nsISupportsArray);
    var arg = Cc["@mozilla.org/supports-string;1"].
              createInstance(Ci.nsISupportsString);
    arg.data = "updates-only";
    param.AppendElement(arg);
    ww.openWindow(null, EMURL, null, EMFEATURES, param);
  },

  /**
   * Clean up on application shutdown to avoid leaks.
   */
  _shutdown: function EM__shutdown() {
    if (!gAllowFlush) {
      // Something went wrong and there are potentially flushes pending.
      ERROR("Reached _shutdown and without clearing any pending flushes");
      try {
        gAllowFlush = true;
        if (gManifestNeedsFlush) {
          gManifestNeedsFlush = false;
          this._updateManifests(false);
        }
        if (gDSNeedsFlush) {
          gDSNeedsFlush = false;
          this.datasource.Flush();
        }
      }
      catch (e) {
        ERROR("Error flushing caches: " + e);
      }
    }

    gOS.removeObserver(this, "xpcom-shutdown");

    // Release strongly held services.
    gOS = null;
    if (this._ds) {
      gRDF.UnregisterDataSource(this._ptr);
      this._ptr = null;
      this._ds.shutdown();
      this._ds = null;
    }
    gRDF = null;
    if (gPref) {
      gPref.removeObserver("extensions.", this);
      gPref.removeObserver(PREF_MATCH_OS_LOCALE, this);
      gPref.removeObserver(PREF_SELECTED_LOCALE, this);
    }
    gPref = null;
    gConsole = null;
    gVersionChecker = null;
    gDirService = null;
    gInstallManifestRoot = null;
    gApp = null;
  },

  /**
   * Check for presence of critical Extension system files. If any is missing,
   * delete the others and signal that the system needs to rebuild them all
   * from scratch.
   * @returns true if any critical file is missing and the system needs to
   *          be rebuilt, false otherwise.
   */
  _ensureDatasetIntegrity: function EM__ensureDatasetIntegrity() {
    var profD = getDirNoCreate(KEY_PROFILEDIR, []);
    var extensionsDS = profD.clone();
    extensionsDS.append(FILE_EXTENSIONS);
    var extensionsINI = profD.clone();
    extensionsINI.append(FILE_EXTENSION_MANIFEST);
    var extensionsCache = profD;
    extensionsCache.append(FILE_EXTENSIONS_STARTUP_CACHE);

    var dsExists = extensionsDS.exists();
    var iniExists = extensionsINI.exists();
    var cacheExists = extensionsCache.exists();

    if (dsExists && iniExists && cacheExists)
      return [false, !iniExists];

    // If any of the files are missing, remove the .ini file
    if (iniExists)
      extensionsINI.remove(false);

    // If the extensions datasource is missing remove the .cache file if it exists
    if (!dsExists && cacheExists)
      extensionsCache.remove(false);

    return [true, !iniExists];
  },

  /**
   * See nsIExtensionManager.idl
   */
  start: function EM_start(commandLine) {
    var isDirty, forceAutoReg;

    // Check for missing manifests - e.g. missing extensions.ini, missing
    // extensions.cache, extensions.rdf etc. If any of these files
    // is missing then we are in some kind of weird or initial state and need
    // to force a regeneration.
    [isDirty, forceAutoReg] = this._ensureDatasetIntegrity();

    // Block attempts to flush for the entire startup
    gAllowFlush = false;

    // Configure any items that are being installed, uninstalled or upgraded
    // by being added, removed or modified by another process. We must do this
    // on every startup since there is no way we can tell if this has happened
    // or not!
    if (this._checkForFileChanges())
      isDirty = true;

    this._showUpdatesWindow();

    if (PendingOperations.size != 0)
      isDirty = true;

    var needsRestart = false;
    // Extension Changes
    if (isDirty) {
      needsRestart = this._finishOperations();

      if (forceAutoReg) {
        this._extensionListChanged = true;
        needsRestart = true;
      }
    }

    // Resume flushing and perform a flush for anything that was deferred
    try {
      gAllowFlush = true;
      if (gManifestNeedsFlush) {
        gManifestNeedsFlush = false;
        this._updateManifests(false);
      }
      if (gDSNeedsFlush) {
        gDSNeedsFlush = false;
        this.datasource.Flush();
      }
    }
    catch (e) {
      ERROR("Error flushing caches: " + e);
    }

    if (!needsRestart)
      this._startTimers();

    return needsRestart;
  },

  /**
   * Begins all background update check timers
   */
  _startTimers: function EM__startTimers() {
    // Register a background update check timer
    var tm = Cc["@mozilla.org/updates/timer-manager;1"].
             getService(Ci.nsIUpdateTimerManager);
    var interval = getPref("getIntPref", PREF_EM_UPDATE_INTERVAL, 86400);
    tm.registerTimer("addon-background-update-timer", this, interval);
  },

  /**
   * Notified when a timer fires
   * @param   timer
   *          The timer that fired
   */
  notify: function EM_notify(timer) {
    if (!getPref("getBoolPref", PREF_EM_UPDATE_ENABLED, true))
      return;

    var items = this.getItemList(Ci.nsIUpdateItem.TYPE_ANY, { });

    var updater = new ExtensionItemUpdater(this);
    updater.checkForUpdates(items, items.length,
                            Ci.nsIExtensionManager.UPDATE_CHECK_NEWVERSION,
                            new BackgroundUpdateCheckListener(this.datasource),
                            null, null);
  },

  /**
   * See nsIExtensionManager.idl
   */
  handleCommandLineArgs: function EM_handleCommandLineArgs(commandLine) {
    try {
      var globalExtension = commandLine.handleFlagWithParam("install-global-extension", false);
      if (globalExtension) {
        var file = commandLine.resolveFile(globalExtension);
        this._installGlobalItem(file);
      }
      var globalTheme = commandLine.handleFlagWithParam("install-global-theme", false);
      if (globalTheme) {
        file = commandLine.resolveFile(globalTheme);
        this._installGlobalItem(file);
      }
    }
    catch (e) {
      ERROR("ExtensionManager:handleCommandLineArgs - failure, catching exception - lineno: " +
            e.lineNumber + " - file: " + e.fileName + " - " + e);
    }
    commandLine.preventDefault = true;
  },

  /**
   * Installs an XPI/JAR file into the KEY_APP_GLOBAL install location.
   * @param   file
   *          The XPI/JAR file to extract
   */
  _installGlobalItem: function EM__installGlobalItem(file) {
    if (!file || !file.exists())
      throw new Error("Unable to find the file specified on the command line!");
//@line 2867 "e:\builds\moz2_slave\mozilla-1.9.1-win32-xulrunner\build\toolkit\mozapps\extensions\src\nsExtensionManager.js.in"
    // make sure the file is local on Windows
    file.normalize();
    if (file.path[1] != ':')
      throw new Error("Can't install global chrome from non-local file "+file.path);
//@line 2872 "e:\builds\moz2_slave\mozilla-1.9.1-win32-xulrunner\build\toolkit\mozapps\extensions\src\nsExtensionManager.js.in"
    var installManifestFile = extractRDFFileToTempDir(file, FILE_INSTALL_MANIFEST, true);
    if (!installManifestFile.exists())
      throw new Error("The package is missing an install manifest!");
    var installManifest = getInstallManifest(installManifestFile);
    installManifestFile.remove(false);
    var installData = this._getInstallData(installManifest);
    var installer = new Installer(installManifest, installData.id,
                                  InstallLocations.get(KEY_APP_GLOBAL),
                                  installData.type);
    installer._installExtensionFiles(file);
    if (installData.type == Ci.nsIUpdateItem.TYPE_THEME)
      installer.upgradeThemeChrome();
    else
      installer.upgradeExtensionChrome();
  },

  /**
   * Check to see if a file is a XPI/JAR file that the user dropped into this
   * Install Location. (i.e. a XPI that is not a staged XPI from an install
   * transaction that is currently in operation).
   * @param   file
   *          The XPI/JAR file to configure
   * @param   location
   *          The Install Location where this file was found.
   * @returns A nsIUpdateItem representing the dropped XPI if this file was a
   *          XPI/JAR that needs installation, null otherwise.
   */
  _getItemForDroppedFile: function EM__getItemForDroppedFile(file, location) {
    if (fileIsItemPackage(file)) {
      // We know nothing about this item, it is not something we've
      // staged in preparation for finalization, so assume it's something
      // the user dropped in.
      LOG("A Item Package appeared at: " + file.path + " that we know " +
          "nothing about, assuming it was dropped in by the user and " +
          "configuring for installation now. Location Key: " + location.name);

      var installManifestFile = extractRDFFileToTempDir(file, FILE_INSTALL_MANIFEST, true);
      if (!installManifestFile.exists())
        return null;
      var installManifest = getInstallManifest(installManifestFile);
      installManifestFile.remove(false);
      var ds = this.datasource;
      var installData = this._getInstallData(installManifest);
      var targetAppInfo = ds.getTargetApplicationInfo(installData.id, installManifest);
      return makeItem(installData.id,
                      installData.version,
                      location.name,
                      targetAppInfo ? targetAppInfo.minVersion : "",
                      targetAppInfo ? targetAppInfo.maxVersion : "",
                      getManifestProperty(installManifest, "name"),
                      "", /* XPI Update URL */
                      "", /* XPI Update Hash */
                      getManifestProperty(installManifest, "iconURL"),
                      getManifestProperty(installManifest, "updateURL"),
                      getManifestProperty(installManifest, "updateKey"),
                      installData.type,
                      targetAppInfo ? targetAppInfo.appID : gApp.ID);
    }
    return null;
  },

  /**
   * Configure an item that was installed or upgraded by another process
   * so that |_finishOperations| can properly complete processing and
   * registration.
   * As this is the only point at which we can reliably know the Install
   * Location of this item, we use this as an opportunity to:
   * 1. Check that this item is compatible with this Firefox version.
   * 2. If it is, configure the item by using the supplied callback.
   *    We do not do any special handling in the case that the item is
   *    not compatible with this version other than to simply not register
   *    it and log that fact - there is no "phone home" check for updates.
   *    It may or may not make sense to do this, but for now we'll just
   *    not register.
   * @param   id
   *          The GUID of the item to validate and configure.
   * @param   location
   *          The Install Location where this item is installed.
   * @param   callback
   *          The callback that configures the item for installation upon
   *          successful validation.
   */
   installItem: function EM_installItem(id, location, callback) {
    // As this is the only pint at which we reliably know the installation
    var installRDF = location.getItemFile(id, FILE_INSTALL_MANIFEST);
    if (installRDF.exists()) {
      LOG("Item Installed/Upgraded at Install Location: " + location.name +
          " Item ID: " + id + ", attempting to register...");
      var installManifest = getInstallManifest(installRDF);
      var installData = this._getInstallData(installManifest);
      if (installData.error == INSTALLERROR_SUCCESS) {
        LOG("... success, item is compatible");
        callback(installManifest, installData.id, location, installData.type);
      }
      else if (installData.error == INSTALLERROR_INCOMPATIBLE_VERSION) {
        LOG("... success, item installed but is not compatible");
        callback(installManifest, installData.id, location, installData.type);
        this._appDisableItem(id);
      }
      else if (installData.error == INSTALLERROR_INSECURE_UPDATE) {
        LOG("... success, item installed but does not provide updates securely");
        callback(installManifest, installData.id, location, installData.type);
        this._appDisableItem(id);
      }
      else if (installData.error == INSTALLERROR_BLOCKLISTED) {
        LOG("... success, item installed but is blocklisted");
        callback(installManifest, installData.id, location, installData.type);
        this._appDisableItem(id);
      }
      else if (installData.error == INSTALLERROR_SOFTBLOCKED) {
        LOG("... success, item installed but is soft blocked, item will be disabled");
        callback(installManifest, installData.id, location, installData.type);
        this.disableItem(id);
      }
      else {
        /**
         * Turns an error code into a message for logging
         * @param   error
         *          an Install Error code
         * @returns A string message to be logged.
         */
        function translateErrorMessage(error) {
          switch (error) {
          case INSTALLERROR_INVALID_GUID:
            return "Invalid GUID";
          case INSTALLERROR_INVALID_VERSION:
            return "Invalid Version";
          case INSTALLERROR_INCOMPATIBLE_PLATFORM:
            return "Incompatible Platform";
          }
        }
        LOG("... failure, item is not compatible, error: " +
            translateErrorMessage(installData.error));

        // Add the item to the Startup Cache anyway, so we don't re-detect it
        // every time the app starts.
        StartupCache.put(location, id, OP_NONE, true);
      }
    }
  },

  /**
   * Check for changes to items that were made independently of the Extension
   * Manager, e.g. items were added or removed from a Install Location or items
   * in an Install Location changed.
   */
  _checkForFileChanges: function EM__checkForFileChanges() {
    var em = this;

    /**
     * Determines if an item can be used based on whether or not the install
     * location of the "item" has an equal or higher priority than the install
     * location where another version may live.
     * @param   id
     *          The GUID of the item being installed.
     * @param   location
     *          The location where an item is to be installed.
     * @returns true if the item can be installed at that location, false
     *          otherwise.
     */
    function canUse(id, location) {
      for (var locationKey in StartupCache.entries) {
        if (locationKey != location.name &&
            id in StartupCache.entries[locationKey]) {
          if (StartupCache.entries[locationKey][id]) {
            var oldInstallLocation = InstallLocations.get(locationKey);
            if (oldInstallLocation.priority <= location.priority)
              return false;
          }
        }
      }
      return true;
    }

    /**
      * Gets a Dialog Param Block loaded with a set of strings to initialize the
      * XPInstall Confirmation Dialog.
      * @param   strings
      *          An array of strings
      * @returns A nsIDialogParamBlock loaded with the strings and dialog state.
      */
    function getParamBlock(strings) {
      var dpb = Cc["@mozilla.org/embedcomp/dialogparam;1"].
                createInstance(Ci.nsIDialogParamBlock);
      // OK and Cancel Buttons
      dpb.SetInt(0, 2);
      // Number of Strings
      dpb.SetInt(1, strings.length);
      dpb.SetNumberStrings(strings.length);
      // Add Strings
      for (var i = 0; i < strings.length; ++i)
        dpb.SetString(i, strings[i]);

      var supportsString = Cc["@mozilla.org/supports-string;1"].
                           createInstance(Ci.nsISupportsString);
      var bundle = BundleManager.getBundle(URI_EXTENSIONS_PROPERTIES);
      supportsString.data = bundle.GetStringFromName("droppedInWarning");
      var objs = Cc["@mozilla.org/array;1"].
                 createInstance(Ci.nsIMutableArray);
      objs.appendElement(supportsString, false);
      dpb.objects = objs;
      return dpb;
    }

    /**
     * Installs a set of files which were dropped into an install location by
     * the user, only after user confirmation.
     * @param   droppedInFiles
     *          An array of JS objects with the following properties:
     *          "file"      The nsILocalFile where the XPI lives
     *          "location"  The Install Location where the XPI was found.
     * @param   xpinstallStrings
     *          An array of strings used to initialize the XPInstall Confirm
     *          dialog.
     */
    function installDroppedInFiles(droppedInFiles, xpinstallStrings) {
      if (droppedInFiles.length == 0)
        return;

      var dpb = getParamBlock(xpinstallStrings);
      var ifptr = Cc["@mozilla.org/supports-interface-pointer;1"].
                  createInstance(Ci.nsISupportsInterfacePointer);
      ifptr.data = dpb;
      ifptr.dataIID = Ci.nsIDialogParamBlock;
      var ww = Cc["@mozilla.org/embedcomp/window-watcher;1"].
               getService(Ci.nsIWindowWatcher);
      ww.openWindow(null, URI_XPINSTALL_CONFIRM_DIALOG,
                    "", "chrome,centerscreen,modal,dialog,titlebar", ifptr);
      if (!dpb.GetInt(0)) {
        // User said OK - install items
        for (var i = 0; i < droppedInFiles.length; ++i) {
          em.installItemFromFile(droppedInFiles[i].file,
                                 droppedInFiles[i].location.name);
          // We are responsible for cleaning up this file
          droppedInFiles[i].file.remove(false);
        }
      }
      else {
        for (i = 0; i < droppedInFiles.length; ++i) {
          // We are responsible for cleaning up this file
          droppedInFiles[i].file.remove(false);
        }
      }
    }

    var isDirty = false;
    var ignoreMTimeChanges = getPref("getBoolPref", PREF_EM_IGNOREMTIMECHANGES,
                                     false);
    StartupCache.read();

    // Array of objects with 'location' and 'id' properties to maybe install.
    var newItems = [];

    var droppedInFiles = [];
    var xpinstallStrings = [];

    // Enumerate over the install locations from low to high priority.  The
    // enumeration returned is pre-sorted.
    var installLocations = this.installLocations;
    while (installLocations.hasMoreElements()) {
      var location = installLocations.getNext().QueryInterface(Ci.nsIInstallLocation);

      // Hash the set of items actually held by the Install Location.
      var actualItems = { };
      var entries = location.itemLocations;
      while (true) {
        var entry = entries.nextFile;
        if (!entry)
          break;

        // Is this location a valid item? It must be a directory, and contain
        // an install.rdf manifest:
        if (entry.isDirectory()) {
          var installRDF = entry.clone();
          installRDF.append(FILE_INSTALL_MANIFEST);

          var id = location.getIDForLocation(entry);
          if (!id || (!installRDF.exists() &&
                      !location.itemIsManagedIndependently(id)))
            continue;

          actualItems[id] = entry;
        }
        else {
          // Check to see if this file is a XPI/JAR dropped into this dir
          // by the user, installing it if necessary. We do this here rather
          // than separately in |_finishOperations| because I don't want to
          // walk these lists multiple times on every startup.
          var item = this._getItemForDroppedFile(entry, location);
          if (item) {
            droppedInFiles.push({ file: entry, location: location });
            var prettyName = "";
            try {
              var zipReader = getZipReaderForFile(entry);
              var principal = { };
              var certPrincipal = zipReader.getCertificatePrincipal(null, principal);
              // XXXbz This string could be empty.  This needs better
              // UI to present principal.value.certificate's subject.
              prettyName = principal.value.prettyName;
            }
            catch (e) { }
            if (zipReader)
              zipReader.close();
            xpinstallStrings = xpinstallStrings.concat([item.name,
                                                        getURLSpecFromFile(entry),
                                                        item.iconURL,
                                                        prettyName]);
            isDirty = true;
          }
        }
      }

      if (location.name in StartupCache.entries) {
        // Look for items that have been uninstalled by removing their directory.
        for (var id in StartupCache.entries[location.name]) {
          if (!StartupCache.entries[location.name] ||
              !StartupCache.entries[location.name][id])
            continue;

          // Force _finishOperations to run if we have enabled or disabled items.
          // XXXdarin this should be unnecessary now that we check
          // PendingOperations.size in start()
          if (StartupCache.entries[location.name][id].op == OP_NEEDS_ENABLE ||
              StartupCache.entries[location.name][id].op == OP_NEEDS_DISABLE)
            isDirty = true;

          if (!(id in actualItems) &&
              StartupCache.entries[location.name][id].op != OP_NEEDS_UNINSTALL &&
              StartupCache.entries[location.name][id].op != OP_NEEDS_INSTALL &&
              StartupCache.entries[location.name][id].op != OP_NEEDS_UPGRADE) {
            // We have an entry for this id in the Extensions database, for this
            // install location, but it no longer exists in the Install Location.
            // We can infer from this that the item has been removed, so uninstall
            // it properly.
            if (canUse(id, location)) {
              LOG("Item Uninstalled via file removal from: " + StartupCache.entries[location.name][id].descriptor +
                  " Item ID: " + id + " Location Key: " + location.name + ", uninstalling item.");

              // Load the Extensions Datasource and force this item into the visible
              // items list if it is not already. This allows us to handle the case
              // where there is an entry for an item in the Startup Cache but not
              // in the extensions.rdf file - in that case the item will not be in
              // the visible list and calls to |getInstallLocation| will mysteriously
              // fail.
              this.datasource.updateVisibleList(id, location.name, false);
              this.uninstallItem(id);
              isDirty = true;
            }
          }
          else if (!ignoreMTimeChanges) {
            // Look for items whose mtime has changed, and as such we can assume
            // they have been "upgraded".
            var lf = { path: StartupCache.entries[location.name][id].descriptor };
            try {
               lf = getFileFromDescriptor(StartupCache.entries[location.name][id].descriptor, location);
            }
            catch (e) { }

            if (lf.exists && lf.exists()) {
              var actualMTime = Math.floor(lf.lastModifiedTime / 1000);
              if (actualMTime != StartupCache.entries[location.name][id].mtime) {
                LOG("Item Location path changed: " + lf.path + " Item ID: " +
                    id + " Location Key: " + location.name + ", attempting to upgrade item...");
                if (canUse(id, location)) {
                  this.installItem(id, location,
                                   function(installManifest, id, location, type) {
                                     em._upgradeItem(installManifest, id, location,
                                                     type);
                                   });
                  isDirty = true;
                }
              }
            }
            else {
              isDirty = true;
              LOG("Install Location returned a missing or malformed item path! " +
                  "Item Path: " + lf.path + ", Location Key: " + location.name +
                  " Item ID: " + id);
              if (canUse(id, location)) {
                // Load the Extensions Datasource and force this item into the visible
                // items list if it is not already. This allows us to handle the case
                // where there is an entry for an item in the Startup Cache but not
                // in the extensions.rdf file - in that case the item will not be in
                // the visible list and calls to |getInstallLocation| will mysteriously
                // fail.
                this.datasource.updateVisibleList(id, location.name, false);
                this.uninstallItem(id);
              }
            }
          }
        }
      }

      // Look for items that have been installed by appearing in the location.
      for (var id in actualItems) {
        if (!(location.name in StartupCache.entries) ||
            !(id in StartupCache.entries[location.name]) ||
            !StartupCache.entries[location.name][id]) {
          // Remember that we've seen this item
          StartupCache.put(location, id, OP_NONE, true);
          // Push it on the stack of items to maybe install later
          newItems.push({location: location, id: id});
        }
      }
    }

    // Process any newly discovered items.  We do this here instead of in the
    // previous loop so that we can be sure that we have a fully populated
    // StartupCache.
    for (var i = 0; i < newItems.length; ++i) {
      var id = newItems[i].id;
      var location = newItems[i].location;
      if (canUse(id, location)) {
        LOG("Item Installed via directory addition to Install Location: " +
            location.name + " Item ID: " + id + ", attempting to register...");
        this.installItem(id, location,
                         function(installManifest, id, location, type) {
                           em._configureForthcomingItem(installManifest, id, location,
                                                        type);
                         });
        // Disable add-ons on install when the InstallDisabled file exists.
        // This is so Talkback will be disabled on a subset of installs.
        var installDisabled = location.getItemFile(id, "InstallDisabled");
        if (installDisabled.exists())
          em.disableItem(id);
        isDirty = true;
      }
    }

    // Ask the user if they want to install the dropped items, for security
    // purposes.
    installDroppedInFiles(droppedInFiles, xpinstallStrings);

    return isDirty;
  },

  /**
   * Upgrades contents.rdf files to chrome.manifest files for any existing
   * Extensions and Themes.
   * @returns true if actions were performed that require a restart, false
   *          otherwise.
   */
  _upgradeChrome: function EM__upgradeChrome() {
    if (inSafeMode())
      return false;

    var checkForNewChrome = false;
    var ds = this.datasource;
    // If we have extensions that were installed before the new flat chrome
    // manifests, and are still valid, we need to manually create the flat
    // manifest files.
    var extensions = this._getActiveItems(Ci.nsIUpdateItem.TYPE_EXTENSION +
                                          Ci.nsIUpdateItem.TYPE_LOCALE);
    for (var i = 0; i < extensions.length; ++i) {
      var e = extensions[i];
      var itemLocation = e.location.getItemLocation(e.id);
      var manifest = itemLocation.clone();
      manifest.append(FILE_CHROME_MANIFEST);
      if (!manifest.exists()) {
        var installRDF = itemLocation.clone();
        installRDF.append(FILE_INSTALL_MANIFEST);
        var installLocation = this.getInstallLocation(e.id);
        if (installLocation && installRDF.exists()) {
          var itemLocation = installLocation.getItemLocation(e.id);
          if (itemLocation.exists() && itemLocation.isDirectory()) {
            var installer = new Installer(ds, e.id, installLocation,
                                          Ci.nsIUpdateItem.TYPE_EXTENSION);
            installer.upgradeExtensionChrome();
          }
        }
        else {
          ds.removeItemMetadata(e.id);
          ds.removeItemFromContainer(e.id);
        }

        checkForNewChrome = true;
      }
    }

    var themes = this._getActiveItems(Ci.nsIUpdateItem.TYPE_THEME);
    // If we have themes that were installed before the new flat chrome
    // manifests, and are still valid, we need to manually create the flat
    // manifest files.
    for (i = 0; i < themes.length; ++i) {
      var item = themes[i];
      var itemLocation = item.location.getItemLocation(item.id);
      var manifest = itemLocation.clone();
      manifest.append(FILE_CHROME_MANIFEST);
      if (manifest.exists() ||
          item.id == stripPrefix(RDFURI_DEFAULT_THEME, PREFIX_ITEM_URI))
        continue;

      var entries;
      try {
        var manifestURI = getURIFromFile(manifest);
        var chromeDir = itemLocation.clone();
        chromeDir.append(DIR_CHROME);

        if (!chromeDir.exists() || !chromeDir.isDirectory()) {
          ds.removeItemMetadata(item.id);
          ds.removeItemFromContainer(item.id);
          continue;
        }

        // We're relying on the fact that there is only one JAR file
        // in the "chrome" directory. This is a hack, but it works.
        entries = chromeDir.directoryEntries.QueryInterface(Ci.nsIDirectoryEnumerator);
        var jarFile = entries.nextFile;
        if (jarFile) {
          var jarFileURI = getURIFromFile(jarFile);
          var contentsURI = newURI("jar:" + jarFileURI.spec + "!/");

          // Use the Chrome Registry API to install the theme there
          var cr = Cc["@mozilla.org/chrome/chrome-registry;1"].
                   getService(Ci.nsIToolkitChromeRegistry);
          cr.processContentsManifest(contentsURI, manifestURI, contentsURI, false, true);
        }
        entries.close();
      }
      catch (e) {
        ERROR("_upgradeChrome: failed to upgrade contents manifest for " +
              "theme: " + item.id + ", exception: " + e + "... The theme will be " +
              "disabled.");
        this._appDisableItem(item.id);
      }
      finally {
        try {
          entries.close();
        }
        catch (e) {
        }
      }
      checkForNewChrome = true;
    }
    return checkForNewChrome;
  },

  _checkForUncoveredItem: function EM__checkForUncoveredItem(id) {
    var ds = this.datasource;
    var oldLocation = this.getInstallLocation(id);
    var newLocations = [];
    for (var locationKey in StartupCache.entries) {
      var location = InstallLocations.get(locationKey);
      if (id in StartupCache.entries[locationKey] &&
          location.priority > oldLocation.priority)
        newLocations.push(location);
    }
    newLocations.sort(function(a, b) { return b.priority - a.priority; });
    if (newLocations.length > 0) {
      for (var i = 0; i < newLocations.length; ++i) {
        // Check to see that the item at the location exists
        var installRDF = newLocations[i].getItemFile(id, FILE_INSTALL_MANIFEST);
        if (installRDF.exists()) {
          // Update the visible item cache so that |_finalizeUpgrade| is properly
          // called from |_finishOperations|
          var name = newLocations[i].name;
          ds.updateVisibleList(id, name, true);
          PendingOperations.addItem(OP_NEEDS_UPGRADE,
                                    { locationKey: name, id: id });
          PendingOperations.addItem(OP_NEEDS_INSTALL,
                                    { locationKey: name, id: id });
          break;
        }
        else {
          // If no item exists at the location specified, remove this item
          // from the visible items list and check again.
          StartupCache.clearEntry(newLocations[i], id);
          ds.updateVisibleList(id, null, true);
        }
      }
    }
    else
      ds.updateVisibleList(id, null, true);
  },

  /**
   * Finish up pending operations - perform upgrades, installs, enables/disables,
   * uninstalls etc.
   * @returns true if actions were performed that require a restart, false
   *          otherwise.
   */
  _finishOperations: function EM__finishOperations() {
    try {
      // Stuff has changed, load the Extensions datasource in all its RDFey
      // glory.
      var ds = this.datasource;
      var updatedTargetAppInfos = [];

      var needsRestart = false;
      var upgrades = [];
      var newAddons = [];
      var addons = getPref("getCharPref", PREF_EM_NEW_ADDONS_LIST, "");
      if (addons != "")
        newAddons = addons.split(",");
      do {
        // Enable and disable during startup so items that are changed in the
        // ui can be reset to a no-op.
        // Look for extensions that need to be enabled.
        var items = PendingOperations.getOperations(OP_NEEDS_ENABLE);
        for (var i = items.length - 1; i >= 0; --i) {
          var id = items[i].id;
          var installLocation = this.getInstallLocation(id);
          StartupCache.put(installLocation, id, OP_NONE, true);
          PendingOperations.clearItem(OP_NEEDS_ENABLE, id);
          needsRestart = true;
        }
        PendingOperations.clearItems(OP_NEEDS_ENABLE);

        // Look for extensions that need to be disabled.
        items = PendingOperations.getOperations(OP_NEEDS_DISABLE);
        for (i = items.length - 1; i >= 0; --i) {
          id = items[i].id;
          installLocation = this.getInstallLocation(id);
          StartupCache.put(installLocation, id, OP_NONE, true);
          PendingOperations.clearItem(OP_NEEDS_DISABLE, id);
          needsRestart = true;
        }
        PendingOperations.clearItems(OP_NEEDS_DISABLE);

        // Look for extensions that need to be upgraded. The process here is to
        // uninstall the old version of the extension first, then install the
        // new version in its place.
        items = PendingOperations.getOperations(OP_NEEDS_UPGRADE);
        for (i = items.length - 1; i >= 0; --i) {
          id = items[i].id;
          var newLocation = InstallLocations.get(items[i].locationKey);
          // check if there is updated app compatibility info
          var newTargetAppInfo = ds.getUpdatedTargetAppInfo(id);
          if (newTargetAppInfo)
            updatedTargetAppInfos.push(newTargetAppInfo);
          this._finalizeUpgrade(id, newLocation);
          upgrades.push(id);
        }
        PendingOperations.clearItems(OP_NEEDS_UPGRADE);

        // Install items
        items = PendingOperations.getOperations(OP_NEEDS_INSTALL);
        for (i = items.length - 1; i >= 0; --i) {
          needsRestart = true;
          id = items[i].id;
          // check if there is updated app compatibility info
          newTargetAppInfo = ds.getUpdatedTargetAppInfo(id);
          if (newTargetAppInfo)
            updatedTargetAppInfos.push(newTargetAppInfo);
          this._finalizeInstall(id, null);
          if (upgrades.indexOf(id) < 0 && newAddons.indexOf(id) < 0)
            newAddons.push(id);
        }
        PendingOperations.clearItems(OP_NEEDS_INSTALL);

        // Look for extensions that need to be removed. This MUST be done after
        // the install operations since extensions to be installed may have to be
        // uninstalled if there are errors during the installation process!
        items = PendingOperations.getOperations(OP_NEEDS_UNINSTALL);
        for (i = items.length - 1; i >= 0; --i) {
          id = items[i].id;
          this._finalizeUninstall(id);
          this._checkForUncoveredItem(id);
          needsRestart = true;
          var pos = newAddons.indexOf(id);
          if (pos >= 0)
            newAddons.splice(pos, 1);
        }
        PendingOperations.clearItems(OP_NEEDS_UNINSTALL);

        // When there have been operations and all operations have completed.
        if (PendingOperations.size == 0) {
          // If there is updated app compatibility info update the datasource.
          for (i = 0; i < updatedTargetAppInfos.length; ++i)
            ds.setTargetApplicationInfo(updatedTargetAppInfos[i].id,
                                        updatedTargetAppInfos[i].targetAppID,
                                        updatedTargetAppInfos[i].minVersion,
                                        updatedTargetAppInfos[i].maxVersion,
                                        null);

          // Enumerate all items
          var ctr = getContainer(ds, ds._itemRoot);
          var elements = ctr.GetElements();
          while (elements.hasMoreElements()) {
            var itemResource = elements.getNext().QueryInterface(Ci.nsIRDFResource);

            // Ensure appDisabled is in the correct state.
            id = stripPrefix(itemResource.Value, PREFIX_ITEM_URI);
            if (this._isUsableItem(id))
              ds.setItemProperty(id, EM_R("appDisabled"), null);
            else
              ds.setItemProperty(id, EM_R("appDisabled"), EM_L("true"));

            // userDisabled is set based on its value being OP_NEEDS_ENABLE or
            // OP_NEEDS_DISABLE. This allows us to have an item to be enabled
            // by the app and disabled by the user during a single restart.
            var value = stringData(ds.GetTarget(itemResource, EM_R("userDisabled"), true));
            if (value == OP_NEEDS_ENABLE)
              ds.setItemProperty(id, EM_R("userDisabled"), null);
            else if (value == OP_NEEDS_DISABLE)
              ds.setItemProperty(id, EM_R("userDisabled"), EM_L("true"));
          }
        }
      }
      while (PendingOperations.size > 0);

      // Upgrade contents.rdf files to the new chrome.manifest format for
      // existing Extensions and Themes
      if (this._upgradeChrome()) {
        var cr = Cc["@mozilla.org/chrome/chrome-registry;1"].
                 getService(Ci.nsIChromeRegistry);
        cr.checkForNewChrome();
      }

      // If no additional restart is required, it implies that there are
      // no new components that need registering so we can inform the app
      // not to do any extra startup checking next time round.
      this._updateManifests(needsRestart);

      // Remember the list of add-ons that were installed this time around
      // unless this was a new profile.
      if (!gFirstRun && newAddons.length > 0)
        gPref.setCharPref(PREF_EM_NEW_ADDONS_LIST, newAddons.join(","));
    }
    catch (e) {
      ERROR("ExtensionManager:_finishOperations - failure, catching exception - lineno: " +
            e.lineNumber + " - file: " + e.fileName + " - " + e);
    }
    return needsRestart;
  },

  /**
   * Checks to see if there are items that are incompatible with this version
   * of the application, disables them to prevent incompatibility problems and
   * invokes the Update Wizard to look for newer versions.
   * @returns true if there were incompatible items installed and disabled, and
   *          the application must now be restarted to reinitialize XPCOM,
   *          false otherwise.
   */
  checkForMismatches: function EM_checkForMismatches() {
    // Check to see if the version of the application that is being started
    // now is the same one that was started last time.
    var currAppVersion = gApp.version;
    var lastAppVersion = getPref("getCharPref", PREF_EM_LAST_APP_VERSION, "");
    if (currAppVersion == lastAppVersion)
      return false;
    // With a new profile lastAppVersion doesn't exist yet.
    if (!lastAppVersion) {
      gPref.setCharPref(PREF_EM_LAST_APP_VERSION, currAppVersion);
      return false;
    }

    // Block attempts to flush for the entire startup
    gAllowFlush = false;

    // Version mismatch, we have to load the extensions datasource and do
    // version checking. Time hit here doesn't matter since this doesn't happen
    // all that often.
    this._upgradeFromV10();

    // Make the extensions datasource consistent if it isn't already.
    var isDirty;
    [isDirty,] = this._ensureDatasetIntegrity();

    if (this._checkForFileChanges())
      isDirty = true;

    if (PendingOperations.size != 0)
      isDirty = true;

    if (isDirty)
      this._finishOperations();

    var ds = this.datasource;
    // During app upgrade cleanup invalid entries in the extensions datasource.
    ds.beginUpdateBatch();
    var allResources = ds.GetAllResources();
    while (allResources.hasMoreElements()) {
      var res = allResources.getNext().QueryInterface(Ci.nsIRDFResource);
      if (ds.GetTarget(res, EM_R("downloadURL"), true) ||
          (!ds.GetTarget(res, EM_R("installLocation"), true) &&
          stringData(ds.GetTarget(res, EM_R("appDisabled"), true)) == "true"))
        ds.removeDownload(res.Value);
    }
    ds.endUpdateBatch();

    var badItems = [];
    var allAppManaged = true;
    var ctr = getContainer(ds, ds._itemRoot);
    var elements = ctr.GetElements();
    while (elements.hasMoreElements()) {
      var itemResource = elements.getNext().QueryInterface(Ci.nsIRDFResource);
      var id = stripPrefix(itemResource.Value, PREFIX_ITEM_URI);
      var location = this.getInstallLocation(id);
      if (!location) {
        // Item was in an unknown install location
        badItems.push(id);
        continue;
      }

      if (ds.getItemProperty(id, "appManaged") == "true") {
        // Force an update of the metadata for appManaged extensions since the
        // last modified time is not updated for directories on FAT / FAT32
        // filesystems when software update applies a new version of the app.
        if (location.name == KEY_APP_GLOBAL) {
          var installRDF = location.getItemFile(id, FILE_INSTALL_MANIFEST);
          if (installRDF.exists()) {
            var metadataDS = getInstallManifest(installRDF);
            ds.addItemMetadata(id, metadataDS, location);
            ds.updateProperty(id, "compatible");
          }
        }
      }
      else if (allAppManaged)
        allAppManaged = false;

      var properties = {
        availableUpdateURL: null,
        availableUpdateVersion: null
      };

      if (ds.getItemProperty(id, "providesUpdatesSecurely") == "false") {
        /* It's possible the previous version did not understand updateKeys so
         * check if we can import one for this addon from its manifest. */
        installRDF = location.getItemFile(id, FILE_INSTALL_MANIFEST);
        if (installRDF.exists()) {
          metadataDS = getInstallManifest(installRDF);
          var literal = metadataDS.GetTarget(gInstallManifestRoot, EM_R("updateKey"), true);
          if (literal && literal instanceof Ci.nsIRDFLiteral)
            ds.setItemProperty(id, EM_R("updateKey"), literal);
        }
      }

      // appDisabled is determined by an item being compatible, using secure
      // updates, satisfying its dependencies, and not being blocklisted
      if (this._isUsableItem(id)) {
        if (ds.getItemProperty(id, "appDisabled"))
          properties.appDisabled = null;
      }
      else if (!ds.getItemProperty(id, "appDisabled")) {
        properties.appDisabled = EM_L("true");
      }

      ds.setItemProperties(id, properties);
    }

    // Must clean up outside of the loop. Modifying the container while
    // iterating its contents is bad.
    for (var i = 0; i < badItems.length; i++) {
      id = badItems[i];
      LOG("Item " + id + " was installed in an unknown location, removing.");
      var disabled = ds.getItemProperty(id, "userDisabled") == "true";
      // Clean up the datasource
      ds.removeCorruptItem(id);
      // Check for any unhidden items.
      var entries = StartupCache.findEntries(id);
      if (entries.length > 0) {
        var newLocation = InstallLocations.get(entries[0].location);
        for (var j = 1; j < entries.length; j++) {
          location = InstallLocations.get(entries[j].location);
          if (newLocation.priority < location.priority)
            newLocation = location;
        }
        LOG("Activating item " + id + " in " + newLocation.name);
        var em = this;
        this.installItem(id, newLocation,
                         function(installManifest, id, location, type) {
                           em._configureForthcomingItem(installManifest, id, location,
                                                        type);
                         });
        if (disabled)
          em.disableItem(id);
      }
    }

    // Update the manifests to reflect the items that were disabled / enabled.
    this._updateManifests(true);

    // Always check for compatibility updates when upgrading if we have add-ons
    // that aren't managed by the application.
    if (!allAppManaged)
      this._showMismatchWindow();

    // Finish any pending upgrades from the compatibility update to avoid an
    // additional restart.
    if (PendingOperations.size != 0)
      this._finishOperations();

    // Update the last app version so we don't do this again with this version.
    gPref.setCharPref(PREF_EM_LAST_APP_VERSION, currAppVersion);

    // Prevent extension update dialog from showing
    gPref.setBoolPref(PREF_UPDATE_NOTIFYUSER, false);

    // Re-enable flushing and flush anything that was deferred
    try {
      gAllowFlush = true;
      if (gManifestNeedsFlush) {
        gManifestNeedsFlush = false;
        this._updateManifests(false);
      }
      if (gDSNeedsFlush) {
        gDSNeedsFlush = false;
        this.datasource.Flush();
      }
    }
    catch (e) {
      ERROR("Error flushing caches: " + e);
    }

    return true;
  },

  /**
   * Shows the "Compatibility Updates" UI
   */
  _showMismatchWindow: function EM__showMismatchWindow(items) {
    var wm = Cc["@mozilla.org/appshell/window-mediator;1"].
             getService(Ci.nsIWindowMediator);
    var wizard = wm.getMostRecentWindow("Update:Wizard");
    if (wizard)
      wizard.focus();
    else {
      var features = "chrome,centerscreen,dialog,titlebar,modal";
      // This *must* be modal so as not to break startup! This code is invoked before
      // the main event loop is initiated (via checkForMismatches).
      var ww = Cc["@mozilla.org/embedcomp/window-watcher;1"].
               getService(Ci.nsIWindowWatcher);
      ww.openWindow(null, URI_EXTENSION_UPDATE_DIALOG, "", features, null);
    }
  },

  /*
   * Catch all for facilitating a version 1.0 profile upgrade.
   * 1) removes the abandoned default theme directory from the profile.
   * 2) prepares themes installed with version 1.0 for installation.
   * 3) initiates an install to populate the new extensions datasource.
   * 4) migrates the disabled attribute from the old datasource.
   * 5) migrates the app compatibility info from the old datasource.
   */
  _upgradeFromV10: function EM__upgradeFromV10() {
    var extensionsDS = getFile(KEY_PROFILEDIR, [FILE_EXTENSIONS]);
    var dsExists = extensionsDS.exists();
    // Toolkiit 1.7 profiles (Firefox 1.0, Thunderbird 1.0, etc.) have a default
    // theme directory in the profile's extensions directory that will be
    // disabled due to having a maxVersion that is incompatible with the
    // toolkit 1.8 release of the app.
    var profileDefaultTheme = getDirNoCreate(KEY_PROFILEDS, [DIR_EXTENSIONS,
                                             stripPrefix(RDFURI_DEFAULT_THEME, PREFIX_ITEM_URI)]);
    if (profileDefaultTheme && profileDefaultTheme.exists()) {
      removeDirRecursive(profileDefaultTheme);
      // Sunbird 0.3a1 didn't move the default theme into the app's extensions
      // directory and we can't install it while uninstalling the one in the
      // profile directory. If we have a toolkit 1.8 extensions datasource and
      // a profile default theme deleting the toolkit 1.8 extensions datasource
      // will fix this problem when the datasource is re-created.
      if (dsExists)
        extensionsDS.remove(false);
    }

    // return early if the toolkit 1.7 extensions datasource file doesn't exist.
    var oldExtensionsFile = getFile(KEY_PROFILEDIR, [DIR_EXTENSIONS, "Extensions.rdf"]);
    if (!oldExtensionsFile.exists())
      return;

    // Sunbird 0.2 used a different GUID for the default theme
    profileDefaultTheme = getDirNoCreate(KEY_PROFILEDS, [DIR_EXTENSIONS,
                                         "{8af2d0a7-e394-4de2-ae55-2dae532a7a9b}"]);
    if (profileDefaultTheme && profileDefaultTheme.exists())
      removeDirRecursive(profileDefaultTheme);

    // Firefox 0.9 profiles may have DOMi 1.0 with just an install.rdf
    var profileDOMi = getDirNoCreate(KEY_PROFILEDS, [DIR_EXTENSIONS,
                                     "{641d8d09-7dda-4850-8228-ac0ab65e2ac9}"]);
    if (profileDOMi && profileDOMi.exists())
      removeDirRecursive(profileDOMi);

    // return early to avoid migrating data twice if we already have a
    // toolkit 1.8 extension datasource.
    if (dsExists)
      return;

    // Prepare themes for installation
    // Only enumerate directories in the app-profile and app-global locations.
    var locations = [KEY_APP_PROFILE, KEY_APP_GLOBAL];
    for (var i = 0; i < locations.length; ++i) {
      var location = InstallLocations.get(locations[i]);
      if (!location.canAccess)
        continue;

      var entries = location.itemLocations;
      var entry;
      while ((entry = entries.nextFile)) {
        var installRDF = entry.clone();
        installRDF.append(FILE_INSTALL_MANIFEST);

        var chromeDir = entry.clone();
        chromeDir.append(DIR_CHROME);

        // It must be a directory without an install.rdf and it must contain
        // a chrome directory
        if (!entry.isDirectory() || installRDF.exists() || !chromeDir.exists())
          continue;

        var chromeEntries = chromeDir.directoryEntries.QueryInterface(Ci.nsIDirectoryEnumerator);
        if (!chromeEntries.hasMoreElements())
          continue;

        // We're relying on the fact that there is only one JAR file
        // in the "chrome" directory. This is a hack, but it works.
        var jarFile = chromeEntries.nextFile;
        if (jarFile.isDirectory())
          continue;
        var id = location.getIDForLocation(entry);

        try {
          var zipReader = getZipReaderForFile(jarFile);
          zipReader.extract(FILE_INSTALL_MANIFEST, installRDF);

          var contentsManifestFile = location.getItemFile(id, FILE_CONTENTS_MANIFEST);
          zipReader.extract(FILE_CONTENTS_MANIFEST, contentsManifestFile);

          var rootFiles = ["preview.png", "icon.png"];
          for (var i = 0; i < rootFiles.length; ++i) {
            try {
              var target = location.getItemFile(id, rootFiles[i]);
              zipReader.extract(rootFiles[i], target);
            }
            catch (e) {
            }
          }
          zipReader.close();
        }
        catch (e) {
          ERROR("ExtensionManager:_upgradeFromV10 - failed to extract theme files\r\n" +
                "Exception: " + e);
        }
      }
    }

    // When upgrading from a version 1.0 profile we need to populate the
    // extensions datasource with all items before checking for incompatible
    // items since the datasource hasn't been created yet.
    var itemsToCheck = [];
    if (this._checkForFileChanges()) {
      // Create a list of all items that are to be installed so we can migrate
      // these items's settings to the new datasource.
      var items = PendingOperations.getOperations(OP_NEEDS_INSTALL);
      for (i = items.length - 1; i >= 0; --i) {
        if (items[i].locationKey == KEY_APP_PROFILE ||
            items[i].locationKey == KEY_APP_GLOBAL)
          itemsToCheck.push(items[i].id);
      }
      this._finishOperations();
    }

    // If there are no items to migrate settings for return early.
    if (itemsToCheck.length == 0)
      return;

    var fileURL = getURLSpecFromFile(oldExtensionsFile);
    var oldExtensionsDS = gRDF.GetDataSourceBlocking(fileURL);
    var versionChecker = getVersionChecker();
    var ds = this.datasource;
    var currAppVersion = gApp.version;
    var currAppID = gApp.ID;
    for (var i = 0; i < itemsToCheck.length; ++i) {
      var item = ds.getItemForID(itemsToCheck[i]);
      var oldPrefix = (item.type == Ci.nsIUpdateItem.TYPE_EXTENSION) ? PREFIX_EXTENSION : PREFIX_THEME;
      var oldRes = gRDF.GetResource(oldPrefix + item.id);
      // Disable the item if it was disabled in the version 1.0 extensions
      // datasource.
      if (oldExtensionsDS.GetTarget(oldRes, EM_R("disabled"), true))
        ds.setItemProperty(item.id, EM_R("userDisabled"), EM_L("true"));

      // app enable all items. If it is incompatible it will be app disabled
      // later on.
      ds.setItemProperty(item.id, EM_R("appDisabled"), null);

      // if the item is already compatible don't attempt to migrate the
      // item's compatibility info
      var newRes = getResourceForID(itemsToCheck[i]);
      if (ds.isCompatible(ds, newRes))
        continue;

      var updatedMinVersion = null;
      var updatedMaxVersion = null;
      var targetApps = oldExtensionsDS.GetTargets(oldRes, EM_R("targetApplication"), true);
      while (targetApps.hasMoreElements()) {
        var targetApp = targetApps.getNext();
        if (targetApp instanceof Ci.nsIRDFResource) {
          try {
            var foundAppID = stringData(oldExtensionsDS.GetTarget(targetApp, EM_R("id"), true));
            // Different target application?  (Note:  v1.0 didn't support toolkit app ID)
            if (foundAppID != currAppID)
              continue;

            updatedMinVersion = stringData(oldExtensionsDS.GetTarget(targetApp, EM_R("minVersion"), true));
            updatedMaxVersion = stringData(oldExtensionsDS.GetTarget(targetApp, EM_R("maxVersion"), true));

            // Only set the target app info if the extension's target app info
            // in the version 1.0 extensions datasource makes it compatible
            if (versionChecker.compare(currAppVersion, updatedMinVersion) >= 0 &&
                versionChecker.compare(currAppVersion, updatedMaxVersion) <= 0)
              ds.setTargetApplicationInfo(item.id, foundAppID, updatedMinVersion,
                                          updatedMaxVersion, null);

            break;
          }
          catch (e) {
          }
        }
      }
    }
  },

  /**
   * Write the Extensions List and the Startup Cache
   * @param   needsRestart
   *          true if the application needs to restart again, false otherwise.
   */
  _updateManifests: function EM__updateManifests(needsRestart) {
    // During startup we block flushing until the startup operations are all
    // complete to reduce file accesses that can trigger bug 431065
    if (gAllowFlush) {
      // Write the Startup Cache (All Items, visible or not)
      StartupCache.write();
      // Write the Extensions Locations Manifest (Visible, enabled items)
      this._updateExtensionsManifest();
    }
    else {
      gManifestNeedsFlush = true;
    }

    // Notify nsAppRunner to update the compatibility manifest on next startup
    this._extensionListChanged = needsRestart;
  },

  /**
   * Get a list of items that are currently "active" (turned on) of a specific
   * type
   * @param   type
   *          The nsIUpdateItem type to return a list of items of
   * @returns An array of active items of the specified type.
   */
  _getActiveItems: function EM__getActiveItems(type) {
    var allItems = this.getItemList(type, { });
    var activeItems = [];
    var ds = this.datasource;
    for (var i = 0; i < allItems.length; ++i) {
      var item = allItems[i];

      var installLocation = this.getInstallLocation(item.id);
      // An entry with an invalid install location is not active.
      if (!installLocation)
        continue;
      // An item entry is valid only if it is not disabled, not about to
      // be disabled, and not about to be uninstalled.
      if (installLocation.name in StartupCache.entries &&
          item.id in StartupCache.entries[installLocation.name] &&
          StartupCache.entries[installLocation.name][item.id]) {
        var op = StartupCache.entries[installLocation.name][item.id].op;
        if (op == OP_NEEDS_INSTALL || op == OP_NEEDS_UPGRADE ||
            op == OP_NEEDS_UNINSTALL || op == OP_NEEDS_DISABLE)
          continue;
      }
      // Suppress items that have been disabled by the user or the app.
      if (ds.getItemProperty(item.id, "isDisabled") != "true")
        activeItems.push({ id: item.id, version: item.version,
                           location: installLocation });
    }

    return activeItems;
  },

  /**
   * Write the Extensions List
   */
  _updateExtensionsManifest: function EM__updateExtensionsManifest() {
    // When an operation is performed that requires a component re-registration
    // (extension enabled/disabled, installed, uninstalled), we must write the
    // set of paths where extensions live so that the startup system can determine
    // where additional components, preferences, chrome manifests etc live.
    //
    // To do this we obtain a list of active extensions and themes and write
    // these to the extensions.ini file in the profile directory.
    var validExtensions = this._getActiveItems(Ci.nsIUpdateItem.TYPE_ANY -
                                               Ci.nsIUpdateItem.TYPE_THEME);
    var validThemes     = this._getActiveItems(Ci.nsIUpdateItem.TYPE_THEME);

    var extensionsLocationsFile = getFile(KEY_PROFILEDIR, [FILE_EXTENSION_MANIFEST]);
    var fos = openSafeFileOutputStream(extensionsLocationsFile);

    var enabledItems = [];
    var extensionSectionHeader = "[ExtensionDirs]\r\n";
    fos.write(extensionSectionHeader, extensionSectionHeader.length);
    for (var i = 0; i < validExtensions.length; ++i) {
      var e = validExtensions[i];
      var itemLocation = e.location.getItemLocation(e.id).QueryInterface(Ci.nsILocalFile);
      var descriptor = getAbsoluteDescriptor(itemLocation);
      var line = "Extension" + i + "=" + descriptor + "\r\n";
      fos.write(line, line.length);
      enabledItems.push(e.id + ":" + e.version);
    }

    var themeSectionHeader = "[ThemeDirs]\r\n";
    fos.write(themeSectionHeader, themeSectionHeader.length);
    for (i = 0; i < validThemes.length; ++i) {
      var e = validThemes[i];
      var itemLocation = e.location.getItemLocation(e.id).QueryInterface(Ci.nsILocalFile);
      var descriptor = getAbsoluteDescriptor(itemLocation);
      var line = "Extension" + i + "=" + descriptor + "\r\n";
      fos.write(line, line.length);
      enabledItems.push(e.id + ":" + e.version);
    }

    closeSafeFileOutputStream(fos);

    // Cache the enabled list for annotating the crash report subsequently
    gPref.setCharPref(PREF_EM_ENABLED_ITEMS, enabledItems.join(","));
  },

  /**
   * Say whether or not the Extension List has changed (and thus whether or not
   * the system will have to restart the next time it is started).
   * @param   val
   *          true if the Extension List has changed, false otherwise.
   * @returns |val|
   */
  set _extensionListChanged(val) {
    // When an extension has an operation perform on it (e.g. install, upgrade,
    // disable, etc.) we are responsible for creating the .autoreg file and
    // nsAppRunner is responsible for removing it on restart. At some point it
    // may make sense to be able to cancel a registration but for now we only
    // create the file.
    try {
      var autoregFile = getFile(KEY_PROFILEDIR, [FILE_AUTOREG]);
      if (val && !autoregFile.exists())
        autoregFile.create(Ci.nsILocalFile.NORMAL_FILE_TYPE, PERMS_FILE);
    }
    catch (e) {
    }
    return val;
  },

  /**
   * Gathers data about an item specified by the supplied Install Manifest
   * and determines whether or not it can be installed as-is. It makes this
   * determination by validating the item's GUID, Version, and determining
   * if it is compatible with this application.
   * @param   installManifest
   *          A nsIRDFDataSource representing the Install Manifest of the
   *          item to be installed.
   * @return  A JS Object with the following properties:
   *          "id"       The GUID of the Item being installed.
   *          "version"  The Version string of the Item being installed.
   *          "name"     The Name of the Item being installed.
   *          "type"     The nsIUpdateItem type of the Item being installed.
   *          "targetApps" An array of TargetApplication Info Objects
   *                     with "id", "minVersion" and "maxVersion" properties,
   *                     representing applications targeted by this item.
   *          "error"    The result code:
   *                     INSTALLERROR_SUCCESS
   *                       no error, item can be installed
   *                     INSTALLERROR_INVALID_GUID
   *                       error, GUID is not well-formed
   *                     INSTALLERROR_INVALID_VERSION
   *                       error, Version is not well-formed
   *                     INSTALLERROR_INCOMPATIBLE_VERSION
   *                       error, item is not compatible with this version
   *                       of the application.
   *                     INSTALLERROR_INCOMPATIBLE_PLATFORM
   *                       error, item is not compatible with the operating
   *                       system or ABI the application was built for.
   *                     INSTALLERROR_INSECURE_UPDATE
   *                       error, item has no secure method of providing updates
   *                     INSTALLERROR_BLOCKLISTED
   *                       error, item is blocklisted
   */
  _getInstallData: function EM__getInstallData(installManifest) {
    var installData = { id          : "",
                        version     : "",
                        name        : "",
                        type        : 0,
                        error       : INSTALLERROR_SUCCESS,
                        targetApps  : [],
                        updateURL   : "",
                        updateKey   : "",
                        currentApp  : null };

    // Fetch properties from the Install Manifest
    installData.id       = getManifestProperty(installManifest, "id");
    installData.version  = getManifestProperty(installManifest, "version");
    installData.name     = getManifestProperty(installManifest, "name");
    installData.type     = getAddonTypeFromInstallManifest(installManifest);
    installData.updateURL= getManifestProperty(installManifest, "updateURL");
    installData.updateKey= getManifestProperty(installManifest, "updateKey");

    /**
     * Reads a property off a Target Application resource
     * @param   resource
     *          The RDF Resource for a Target Application
     * @param   property
     *          The property (less EM_NS) to read
     * @returns The string literal value of the property.
     */
    function readTAProperty(resource, property) {
      return stringData(installManifest.GetTarget(resource, EM_R(property), true));
    }

    var targetApps = installManifest.GetTargets(gInstallManifestRoot,
                                                EM_R("targetApplication"),
                                                true);
    while (targetApps.hasMoreElements()) {
      var targetApp = targetApps.getNext();
      if (targetApp instanceof Ci.nsIRDFResource) {
        try {
          var data = { id        : readTAProperty(targetApp, "id"),
                       minVersion: readTAProperty(targetApp, "minVersion"),
                       maxVersion: readTAProperty(targetApp, "maxVersion") };
          installData.targetApps.push(data);
          if ((data.id == gApp.ID) ||
              (data.id == TOOLKIT_ID) && !installData.currentApp)
            installData.currentApp = data;
        }
        catch (e) {
          continue;
        }
      }
    }

    // If the item specifies one or more target platforms, make sure our OS/ABI
    // combination is in the list - otherwise, refuse to install the item.
    var targetPlatforms = null;
    try {
      targetPlatforms = installManifest.GetTargets(gInstallManifestRoot,
                                                   EM_R("targetPlatform"),
                                                   true);
    } catch(e) {
      // No targetPlatform nodes, continue.
    }
    if (targetPlatforms != null && targetPlatforms.hasMoreElements()) {
      var foundMatchingOS = false;
      var foundMatchingOSAndABI = false;
      var requireABICompatibility = false;
      while (targetPlatforms.hasMoreElements()) {
        var targetPlatform = stringData(targetPlatforms.getNext());
        var os = targetPlatform.split("_")[0];
        var index = targetPlatform.indexOf("_");
        var abi = index != -1 ? targetPlatform.substr(index + 1) : null;
        if (os == gOSTarget) {
          foundMatchingOS = true;
          // The presence of any ABI part after our OS means ABI is important.
          if (abi != null) {
            requireABICompatibility = true;
            // If we don't know our ABI, we can't be compatible
            if (abi == gXPCOMABI && abi != UNKNOWN_XPCOM_ABI) {
              foundMatchingOSAndABI = true;
              break;
            }
          }
        }
      }
      if (!foundMatchingOS || (requireABICompatibility && !foundMatchingOSAndABI)) {
        installData.error = INSTALLERROR_INCOMPATIBLE_PLATFORM;
        return installData;
      }
    }

    // Validate the Item ID
    if (!gIDTest.test(installData.id)) {
      installData.error = INSTALLERROR_INVALID_GUID;
      return installData;
    }
    
    // Check that the add-on provides a secure update method.
    if (gCheckUpdateSecurity &&
        installData.updateURL &&
        installData.updateURL.substring(0, 6) != "https:" &&
        !installData.updateKey) {
      installData.error = INSTALLERROR_INSECURE_UPDATE;
      return installData;
    }
      
    // Check that the target application range allows compatibility with the app
    if (gCheckCompatibility &&
        !this.datasource.isCompatible(installManifest, gInstallManifestRoot, undefined)) {
      installData.error = INSTALLERROR_INCOMPATIBLE_VERSION;
      return installData;
    }
    
    // Check if the item is blocklisted.
    if (!gBlocklist)
      gBlocklist = Cc["@mozilla.org/extensions/blocklist;1"].
                   getService(Ci.nsIBlocklistService);
    var state = gBlocklist.getAddonBlocklistState(installData.id, installData.version);
    if (state == Ci.nsIBlocklistService.STATE_BLOCKED)
      installData.error = INSTALLERROR_BLOCKLISTED;
    else if (state == Ci.nsIBlocklistService.STATE_SOFTBLOCKED)
      installData.error = INSTALLERROR_SOFTBLOCKED;

    return installData;
  },

  /**
   * Installs an item from a XPI/JAR file.
   * This is the main entry point into the Install system from outside code
   * (e.g. XPInstall).
   * @param   aXPIFile
   *          The file to install from.
   * @param   aInstallLocationKey
   *          The name of the Install Location where this item should be
   *          installed.
   */
  installItemFromFile: function EM_installItemFromFile(xpiFile, installLocationKey) {
    this.installItemFromFileInternal(xpiFile, installLocationKey, null);

    // If there are no compatibility checks running and no downloads in
    // progress then the install operations are complete.
    if (this._compatibilityCheckCount == 0 && this._transactions.length == 0) {
      for (var i = 0; i < this._installListeners.length; ++i)
        this._installListeners[i].onInstallsCompleted();
    }
  },

  /**
   * Installs an item from a XPI/JAR file.
   * @param   aXPIFile
   *          The file to install from.
   * @param   aInstallLocationKey
   *          The name of the Install Location where this item should be
   *          installed.
   * @param   aInstallManifest
   *          An updated Install Manifest from the Version Update check.
   *          Can be null when invoked from callers other than the Version
   *          Update check.
   * @returns The install result code. If this is INSTALLERROR_PHONING_HOME
   *          then a remote update check has been started to attempt to resolve
   *          compatibility problems.
   */
  installItemFromFileInternal: function EM_installItemFromFileInternal(aXPIFile,
                                                                       aInstallLocationKey,
                                                                       aInstallManifest) {
    var em = this;
    /**
     * Gets the Install Location for an Item.
     * @param   itemID
     *          The GUID of the item to find an Install Location for.
     * @return  An object implementing nsIInstallLocation which represents the
     *          location where the specified item should be installed.
     *          This can be:
     *          1. an object that corresponds to the location key supplied to
     *             |installItemFromFileInternal|,
     *          2. the default install location (the App Profile Extensions Folder)
     *             if no location key was supplied, or the location key supplied
     *             was not in the set of registered locations
     *          3. null, if the location selected by 1 or 2 above does not support
     *             installs from XPI/JAR files, or that location is not writable
     *             with the current access privileges.
     */
    function getInstallLocation(itemID) {
      // Here I use "upgrade" to mean "install a different version of an item".
      var installLocation = em.getInstallLocation(itemID);
      if (!installLocation) {
        // This is not an "upgrade", since we don't have any location data for the
        // extension ID specified - that is, it's not in our database.

        // Caller supplied a key to a registered location, use that location
        // for the installation
        installLocation = InstallLocations.get(aInstallLocationKey);
        if (installLocation) {
          // If the specified location does not have a common metadata location
          // (e.g. extensions have no common root, or other location specified
          // by the location implementation) - e.g. for a Registry Key enumeration
          // location - we cannot install or upgrade using a XPI file, probably
          // because these application types will be handling upgrading themselves.
          // Just bail.
          if (!installLocation.location) {
            LOG("Install Location \"" + installLocation.name + "\" does not support " +
                "installation of items from XPI/JAR files. You must manage " +
                "installation and update of these items yourself.");
            installLocation = null;
          }
        }
        else {
          // In the absence of a preferred install location, just default to
          // the App-Profile
          installLocation = InstallLocations.get(KEY_APP_PROFILE);
        }
      }
      else {
        // This is an "upgrade", but not through the Update System, because the
        // Update code will not let an extension with an incompatible target
        // app version range through to this point. This is an "upgrade" in the
        // sense that the user found a different version of an installed extension
        // and installed it through the web interface, so we have metadata.

        // If the location is different, return the preferred location rather than
        // the location of the currently installed version, because we may be in
        // the situation where an item is being installed into the global app
        // dir when there's a version in the profile dir.
        if (installLocation.name != aInstallLocationKey)
          installLocation = InstallLocations.get(aInstallLocationKey);
      }
      if (!installLocation.canAccess) {
        LOG("Install Location\"" + installLocation.name + "\" cannot be written " +
            "to with your access privileges. Installation will not proceed.");
        installLocation = null;
      }
      return installLocation;
    }

    /**
     * Stages a XPI file in the default item location specified by other
     * applications when they registered with XulRunner if the item's
     * install manifest specified compatibility with them.
     */
    function stageXPIForOtherApps(xpiFile, installData) {
      for (var i = 0; i < installData.targetApps.length; ++i) {
        var targetApp = installData.targetApps[i];
        if (targetApp.id != gApp.ID && targetApp.id != TOOLKIT_ID) {
        /* XXXben uncomment when this works!
          var settingsThingy = Cc[].
                               getService(Ci.nsIXULRunnerSettingsThingy);
          try {
            var appPrefix = "SOFTWARE\\Mozilla\\XULRunner\\Applications\\";
            var branch = settingsThingy.getBranch(appPrefix + targetApp.id);
            var path = branch.getProperty("ExtensionsLocation");
            var destination = Cc["@mozilla.org/file/local;1"].
                              createInstance(Ci.nsILocalFile);
            destination.initWithPath(path);
            xpiFile.copyTo(file, xpiFile.leafName);
          }
          catch (e) {
          }
         */
        }
      }
    }

    /**
     * Extracts and then starts the install for extensions / themes contained
     * within a xpi.
     */
    function installMultiXPI(xpiFile, installData) {
      var fileURL = getURIFromFile(xpiFile).QueryInterface(Ci.nsIURL);
      if (fileURL.fileExtension.toLowerCase() != "xpi") {
        LOG("Invalid File Extension: Item: \"" + fileURL.fileName + "\" has an " +
            "invalid file extension. Only xpi file extensions are allowed for " +
            "multiple item packages.");
        var bundle = BundleManager.getBundle(URI_EXTENSIONS_PROPERTIES);
        showMessage("invalidFileExtTitle", [],
                    "invalidFileExtMessage", [installData.name,
                    fileURL.fileExtension,
                    bundle.GetStringFromName("type-" + installData.type)]);
        return;
      }

      try {
        var zipReader = getZipReaderForFile(xpiFile);
      }
      catch (e) {
        LOG("installMultiXPI: failed to open xpi file: " + xpiFile.path);
        throw e;
      }

      var searchForEntries = ["*.xpi", "*.jar"];
      var files = [];
      for (var i = 0; i < searchForEntries.length; ++i) {
        var entries = zipReader.findEntries(searchForEntries[i]);
        while (entries.hasMore()) {
          var entryName = entries.getNext();
          var target = getFile(KEY_TEMPDIR, [entryName]);
          try {
            target.createUnique(Ci.nsILocalFile.NORMAL_FILE_TYPE, PERMS_FILE);
          }
          catch (e) {
            LOG("installMultiXPI: failed to create target file for extraction " +
                " file = " + target.path + ", exception = " + e + "\n");
          }
          zipReader.extract(entryName, target);
          files.push(target);
        }
      }
      zipReader.close();

      if (files.length == 0) {
        LOG("Multiple Item Package: Item: \"" + fileURL.fileName + "\" does " +
            "not contain a valid package to install.");
        var bundle = BundleManager.getBundle(URI_EXTENSIONS_PROPERTIES);
        showMessage("missingPackageFilesTitle",
                    [bundle.GetStringFromName("type-" + installData.type)],
                    "missingPackageFilesMessage", [installData.name,
                    bundle.GetStringFromName("type-" + installData.type)]);
        return;
      }

      for (i = 0; i < files.length; ++i) {
        em.installItemFromFileInternal(files[i], aInstallLocationKey, null);
        files[i].remove(false);
      }
    }

    /**
     * An observer for the Extension Update System.
     * @constructor
     */
    function IncompatibleObserver() {}
    IncompatibleObserver.prototype = {
      _xpi: null,
      _installManifest: null,

      /**
       * Ask the Extension Update System if there are any version updates for
       * this item that will allow it to be compatible with this version of
       * the Application.
       * @param   item
       *          An nsIUpdateItem representing the item being installed.
       * @param   installManifest
       *          The Install Manifest datasource for the item.
       * @param   xpiFile
       *          The staged source XPI file that contains the item. Cleaned
       *          up by this process.
       * @param   installRDF
       *          The install.rdf file that was extracted from the xpi.
       */
      checkForUpdates: function IncObs_checkForUpdates(item, installManifest, xpiFile) {
        this._xpi             = xpiFile;
        this._installManifest = installManifest;

        for (var i = 0; i < em._installListeners.length; ++i)
          em._installListeners[i].onCompatibilityCheckStarted(item);
        em._compatibilityCheckCount++;
        em.update([item], 1, Ci.nsIExtensionManager.UPDATE_CHECK_COMPATIBILITY, this);
      },

      /**
       * See nsIExtensionManager.idl
       */
      onUpdateStarted: function IncObs_onUpdateStarted() {
        LOG("Phone Home Listener: Update Started");
      },

      /**
       * See nsIExtensionManager.idl
       */
      onUpdateEnded: function IncObs_onUpdateEnded() {
        LOG("Phone Home Listener: Update Ended");
      },

      /**
       * See nsIExtensionManager.idl
       */
      onAddonUpdateStarted: function IncObs_onAddonUpdateStarted(addon) {
        if (!addon)
          throw Cr.NS_ERROR_INVALID_ARG;

        LOG("Phone Home Listener: Update For " + addon.id + " started");
        em.datasource.addIncompatibleUpdateItem(addon.name, this._xpi.path,
                                                addon.type, addon.version);
      },

      /**
       * See nsIExtensionManager.idl
       */
      onAddonUpdateEnded: function IncObs_onAddonUpdateEnded(addon, status) {
        if (!addon)
          throw Cr.NS_ERROR_INVALID_ARG;

        LOG("Phone Home Listener: Update For " + addon.id + " ended, status = " + status);
        em.datasource.removeDownload(this._xpi.path);
        LOG("Version Check Phone Home Completed");

        for (var i = 0; i < em._installListeners.length; ++i)
          em._installListeners[i].onCompatibilityCheckEnded(addon, status);

        // Only compatibility updates (e.g. STATUS_VERSIONINFO) are currently
        // supported
        if (status == Ci.nsIAddonUpdateCheckListener.STATUS_VERSIONINFO) {
          em.datasource.setTargetApplicationInfo(addon.id,
                                                 addon.targetAppID,
                                                 addon.minAppVersion,
                                                 addon.maxAppVersion,
                                                 this._installManifest);

          // Try and install again, but use the updated compatibility DB.
          // This will send out an apropriate onInstallEnded notification for us.
          var status = em.installItemFromFileInternal(this._xpi,
                                                      aInstallLocationKey,
                                                      this._installManifest);

          // The install may still have failed at this point due to the blocklist
          if (status == INSTALLERROR_SUCCESS) {
            // Add the updated compatibility info to the datasource if done
            if (StartupCache.entries[aInstallLocationKey][addon.id].op == OP_NONE) {
              em.datasource.setTargetApplicationInfo(addon.id,
                                                     addon.targetAppID,
                                                     addon.minAppVersion,
                                                     addon.maxAppVersion,
                                                     null);
            }
            else { // needs a restart
              // Add updatedMinVersion and updatedMaxVersion so it can be used
              // to update the datasource during the installation or upgrade.
              em.datasource.setUpdatedTargetAppInfo(addon.id,
                                                    addon.targetAppID,
                                                    addon.minAppVersion,
                                                    addon.maxAppVersion,
                                                    null);
            }
          }
        }
        else {
          em.datasource.removeDownload(this._xpi.path);
          showIncompatibleError(installData);
          LOG("Add-on " + addon.id + " is incompatible with " +
              BundleManager.appName + " " + gApp.version + ", Toolkit " +
              gApp.platformVersion + ". Remote compatibility check did not " +
              "resolve this.");
          
          for (var i = 0; i < em._installListeners.length; ++i)
            em._installListeners[i].onInstallEnded(addon, INSTALLERROR_INCOMPATIBLE_VERSION);

          // We are responsible for cleaning up this file!
          InstallLocations.get(aInstallLocationKey).removeFile(this._xpi);
        }

        em._compatibilityCheckCount--;
        // If there are no more compatibility checks running and no downloads in
        // progress then the install operations are complete.
        if (em._compatibilityCheckCount == 0 && em._transactions.length == 0) {
          for (var i = 0; i < em._installListeners.length; ++i)
            em._installListeners[i].onInstallsCompleted();
        }
      },

      QueryInterface: XPCOMUtils.generateQI([Ci.nsIAddonUpdateCheckListener])
    }

    var shouldPhoneHomeIfNecessary = false;
    if (!aInstallManifest) {
      // If we were not called with an Install Manifest, we were called from
      // some other path than the Phone Home system, so we do want to phone
      // home if the version is incompatible. As this is the first point in the
      // install process we must notify observers here.

      var addon = makeItem(getURIFromFile(aXPIFile).spec, "",
                           aInstallLocationKey, "", "", "",
                           getURIFromFile(aXPIFile).spec,
                           "", "", "", "", 0, gApp.id);
      for (var i = 0; i < this._installListeners.length; ++i)
        this._installListeners[i].onInstallStarted(addon);

      shouldPhoneHomeIfNecessary = true;
      var installManifest = null;
      var installManifestFile = extractRDFFileToTempDir(aXPIFile,
                                                        FILE_INSTALL_MANIFEST,
                                                        true);
      if (installManifestFile.exists()) {
        installManifest = getInstallManifest(installManifestFile);
        installManifestFile.remove(false);
      }
      if (!installManifest) {
        LOG("The Install Manifest supplied by this item is not well-formed. " +
            "Installation will not proceed.");
        for (var i = 0; i < this._installListeners.length; ++i)
          this._installListeners[i].onInstallEnded(addon, INSTALLERROR_INVALID_MANIFEST);
        return INSTALLERROR_INVALID_MANIFEST;
      }
    }
    else
      installManifest = aInstallManifest;

    var installData = this._getInstallData(installManifest);
    // Recreate the add-on item with the full detail from the install manifest
    addon = makeItem(installData.id, installData.version,
                     aInstallLocationKey,
                     installData.currentApp ? installData.currentApp.minVersion : "",
                     installData.currentApp ? installData.currentApp.maxVersion : "",
                     installData.name,
                     getURIFromFile(aXPIFile).spec,
                     "", /* XPI Update Hash */
                     "", /* Icon URL */
                     installData.updateURL || "",
                     installData.updateKey || "",
                     installData.type,
                     installData.currentApp ? installData.currentApp.id : "");

    switch (installData.error) {
    case INSTALLERROR_INCOMPATIBLE_VERSION:
      // Since the caller cleans up |aXPIFile|, and we're not yet sure whether or
      // not we need it (we may need it if a remote version bump that makes it
      // compatible is discovered by the call home) - so we must stage it for
      // later ourselves.
      if (shouldPhoneHomeIfNecessary && installData.currentApp) {
        var installLocation = getInstallLocation(installData.id, aInstallLocationKey);
        if (!installLocation)
          return INSTALLERROR_INCOMPATIBLE_VERSION;
        var stagedFile = installLocation.stageFile(aXPIFile, installData.id);
        (new IncompatibleObserver(this)).checkForUpdates(addon, installManifest,
                                                         stagedFile);
        // Return early to prevent deletion of the install manifest file.
        return INSTALLERROR_PHONING_HOME;
      }
      else {
        // XXXben Look up XULRunnerSettingsThingy to see if there is a registered
        //        app that can handle this item, if so just stage and don't show
        //        this error!
        showIncompatibleError(installData);
        LOG("Add-on " + installData.id + " is incompatible with " +
            BundleManager.appName + " " + gApp.version + ", Toolkit " +
            gApp.platformVersion + ". Remote compatibility check was not performed.");
      }
      break;
    case INSTALLERROR_SOFTBLOCKED:
      if (!showBlocklistMessage(installData, true))
        break;
      installData.error = INSTALLERROR_SUCCESS;
      // Fall through to continue the install
    case INSTALLERROR_SUCCESS:
      // Installation of multiple extensions / themes contained within a single xpi.
      if (installData.type == Ci.nsIUpdateItem.TYPE_MULTI_XPI) {
        installMultiXPI(aXPIFile, installData);
        break;
      }

      // Stage the extension's XPI so it can be extracted at the next restart.
      var installLocation = getInstallLocation(installData.id, aInstallLocationKey);
      if (!installLocation) {
        // No cleanup of any of the staged XPI files should be required here,
        // because this should only ever fail on the first recurse through
        // this function, BEFORE staging takes place... technically speaking
        // a location could become readonly during the phone home process,
        // but that's an edge case I don't care about.
        for (var i = 0; i < this._installListeners.length; ++i)
          this._installListeners[i].onInstallEnded(addon, INSTALLERROR_RESTRICTED);
        return INSTALLERROR_RESTRICTED;
      }

      // Stage a copy of the XPI/JAR file for our own evil purposes...
      stagedFile = installLocation.stageFile(aXPIFile, installData.id);

      var restartRequired = this.installRequiresRestart(installData.id,
                                                        installData.type);
      // Determine which configuration function to use based on whether or not
      // there is data about this item in our datasource already - if there is
      // we want to upgrade, otherwise we install fresh.
      var ds = this.datasource;
      if (installData.id in ds.visibleItems && ds.visibleItems[installData.id]) {
        // We enter this function if any data corresponding to an existing GUID
        // is found, regardless of its Install Location. We need to check before
        // "upgrading" an item that Install Location of the new item is of equal
        // or higher priority than the old item, to make sure the datasource only
        // ever tracks metadata for active items.
        var oldInstallLocation = this.getInstallLocation(installData.id);
        if (oldInstallLocation.priority >= installLocation.priority) {
          this._upgradeItem(installManifest, installData.id, installLocation,
                            installData.type);
          if (!restartRequired) {
            this._finalizeUpgrade(installData.id, installLocation);
            this._finalizeInstall(installData.id, stagedFile);
          }
        }
      }
      else {
        this._configureForthcomingItem(installManifest, installData.id,
                                        installLocation, installData.type);
        if (!restartRequired) {
          this._finalizeInstall(installData.id, stagedFile);
          if (installData.type == Ci.nsIUpdateItem.TYPE_THEME) {
            var internalName = this.datasource.getItemProperty(installData.id, "internalName");
            if (gPref.getBoolPref(PREF_EM_DSS_ENABLED)) {
              gPref.setCharPref(PREF_GENERAL_SKINS_SELECTEDSKIN, internalName);
            }
            else {
              gPref.setBoolPref(PREF_DSS_SWITCHPENDING, true);
              gPref.setCharPref(PREF_DSS_SKIN_TO_SELECT, internalName);
            }
          }
        }
      }
      this._updateManifests(restartRequired);
      break;
    case INSTALLERROR_INVALID_GUID:
      LOG("Invalid GUID: Item has GUID: \"" + installData.id + "\"" +
          " which is not well-formed.");
      var bundle = BundleManager.getBundle(URI_EXTENSIONS_PROPERTIES);
      showMessage("incompatibleTitle",
                  [bundle.GetStringFromName("type-" + installData.type)],
                  "invalidGUIDMessage", [installData.name, installData.id]);
      break;
    case INSTALLERROR_INVALID_VERSION:
      LOG("Invalid Version: Item: \"" + installData.id + "\" has version " +
          installData.version + " which is not well-formed.");
      var bundle = BundleManager.getBundle(URI_EXTENSIONS_PROPERTIES);
      showMessage("incompatibleTitle",
                  [bundle.GetStringFromName("type-" + installData.type)],
                  "invalidVersionMessage", [installData.name, installData.version]);
      break;
    case INSTALLERROR_INCOMPATIBLE_PLATFORM:
      const osABI = gOSTarget + "_" + gXPCOMABI;
      LOG("Incompatible Platform: Item: \"" + installData.id + "\" is not " +
          "compatible with '" + osABI + "'.");
      var bundle = BundleManager.getBundle(URI_EXTENSIONS_PROPERTIES);
      showMessage("incompatibleTitle",
                  [bundle.GetStringFromName("type-" + installData.type)],
                  "incompatiblePlatformMessage",
                  [installData.name, BundleManager.appName, osABI]);
      break;
    case INSTALLERROR_BLOCKLISTED:
      LOG("Blocklisted Item: Item: \"" + installData.id + "\" version " +
          installData.version + " was not installed.");
      showBlocklistMessage(installData, false);
      break;
    case INSTALLERROR_INSECURE_UPDATE:
      LOG("No secure updates: Item: \"" + installData.id + "\" version " + 
          installData.version + " was not installed.");
      var bundle = BundleManager.getBundle(URI_EXTENSIONS_PROPERTIES);
      showMessage("incompatibleTitle", 
                  [bundle.GetStringFromName("type-" + installData.type)], 
                  "insecureUpdateMessage", [installData.name]);
      break;
    default:
      break;
    }

    // Check to see if this item supports other applications and in that case
    // stage the the XPI file in the location specified by those applications.
    stageXPIForOtherApps(aXPIFile, installData);

    // The install of this item is complete, notify observers
    for (var i = 0; i < this._installListeners.length; ++i)
      this._installListeners[i].onInstallEnded(addon, installData.error);

    return installData.error;
  },

  /**
   * Whether or not this type's installation/uninstallation requires
   * the application to be restarted.
   * @param   id
   *          The GUID of the item
   * @param   type
   *          The nsIUpdateItem type of the item
   * @returns true if installation of an item of this type requires a
   *          restart.
   */
  installRequiresRestart: function EM_installRequiresRestart(id, type) {
    switch (type) {
    case Ci.nsIUpdateItem.TYPE_THEME:
      var internalName = this.datasource.getItemProperty(id, "internalName");
      var needsRestart = false;
      if (gPref.prefHasUserValue(PREF_DSS_SKIN_TO_SELECT))
        needsRestart = internalName == gPref.getCharPref(PREF_DSS_SKIN_TO_SELECT);
      if (!needsRestart &&
          gPref.prefHasUserValue(PREF_GENERAL_SKINS_SELECTEDSKIN))
        needsRestart = internalName == gPref.getCharPref(PREF_GENERAL_SKINS_SELECTEDSKIN);
      return needsRestart;
    }
    return ((type & Ci.nsIUpdateItem.TYPE_ADDON) > 0);
  },

  /**
   * Perform initial configuration on an item that has just or will be
   * installed. This inserts the item into the appropriate container in the
   * datasource, so that the application UI shows the item even if it will
   * not actually be installed until the next restart.
   * @param   installManifest
   *          The Install Manifest datasource that describes this item.
   * @param   id
   *          The GUID of this item.
   * @param   installLocation
   *          The Install Location where this item is installed.
   * @param   type
   *          The nsIUpdateItem type of this item.
   */
  _configureForthcomingItem: function EM__configureForthcomingItem(installManifest,
                                                                   id,
                                                                   installLocation,
                                                                   type) {
    var ds = this.datasource;
    ds.updateVisibleList(id, installLocation.name, false);

    var name = null;
    var localized = findClosestLocalizedResource(installManifest, gInstallManifestRoot);
    if (localized)
      name = installManifest.GetTarget(localized, EM_R("name"), true);
    else
      name = EM_L(getManifestProperty(installManifest, "name"));

    var props = { name            : name,
                  version         : EM_L(getManifestProperty(installManifest, "version")),
                  newVersion      : EM_L(getManifestProperty(installManifest, "version")),
                  installLocation : EM_L(installLocation.name),
                  type            : EM_I(type),
                  availableUpdateURL    : null,
                  availableUpdateHash   : null,
                  availableUpdateVersion: null,
                  availableUpdateInfo   : null };
    ds.setItemProperties(id, props);
    ds.updateProperty(id, "availableUpdateURL");

    this._setOp(id, OP_NEEDS_INSTALL);

    // Insert it into the child list NOW rather than later because:
    // - extensions installed using the command line need to be a member
    //   of a container during the install phase for the code to be able
    //   to identify profile vs. global
    // - extensions installed through the UI should show some kind of
    //   feedback to indicate their presence is forthcoming (i.e. they
    //   will be available after a restart).
    ds.insertItemIntoContainer(id);

    this._notifyAction(id, EM_ITEM_INSTALLED);
  },

  /**
   * Perform configuration on an item that has just or will be upgraded.
   * @param   installManifest
   *          The Install Manifest datasource that describes this item.
   * @param   itemID
   *          The GUID of this item.
   * @param   installLocation
   *          The Install Location where this item is installed.
   * @param   type
   *          The nsIUpdateItem type of this item.
   */
  _upgradeItem: function EM__upgradeItem(installManifest, id, installLocation, type) {
    // Don't change any props that would need to be reset if the install fails.
    // They will be reset as appropriate by the upgrade/install process.
    var ds = this.datasource;
    ds.updateVisibleList(id, installLocation.name, false);
    var props = { installLocation : EM_L(installLocation.name),
                  type            : EM_I(type),
                  newVersion      : EM_L(getManifestProperty(installManifest, "version")),
                  availableUpdateURL      : null,
                  availableUpdateHash     : null,
                  availableUpdateVersion  : null,
                  availableUpdateInfo     : null };
    ds.setItemProperties(id, props);
    ds.updateProperty(id, "availableUpdateURL");

    this._setOp(id, OP_NEEDS_UPGRADE);
    this._notifyAction(id, EM_ITEM_UPGRADED);
  },

  /**
   * Completes an Extension's installation.
   * @param   id
   *          The GUID of the Extension to install.
   * @param   file
   *          The XPI/JAR file to install from. If this is null, we try to
   *          determine the stage file location from the ID.
   */
  _finalizeInstall: function EM__finalizeInstall(id, file) {
    var ds = this.datasource;
    var type = ds.getItemProperty(id, "type");
    if (id == 0 || id == -1) {
      ds.removeCorruptItem(id);
      return;
    }
    var installLocation = this.getInstallLocation(id);
    if (!installLocation) {
      // If the install location is null, that means we've reached the finalize
      // state without the item ever having metadata added for it, which implies
      // bogus data in the Startup Cache. Clear the entries and don't do anything
      // else.
      var entries = StartupCache.findEntries(id);
      for (var i = 0; i < entries.length; ++i) {
        var location = InstallLocations.get(entries[i].location);
        StartupCache.clearEntry(location, id);
        PendingOperations.clearItem(OP_NEEDS_INSTALL, id);
      }
      return;
    }
    var itemLocation = installLocation.getItemLocation(id);

    if (!file && "stageFile" in installLocation)
      file = installLocation.getStageFile(id);

    // If |file| is null or does not exist, the installer assumes the item is
    // a dropped-in directory.
    var installer = new Installer(this.datasource, id, installLocation, type);
    installer.installFromFile(file);

    // If the file was staged, we must clean it up ourselves, otherwise the
    // EM caller is responsible for doing so (e.g. XPInstall)
    if (file)
      installLocation.removeFile(file);

    // Clear the op flag from the Startup Cache and Pending Operations sets
    StartupCache.put(installLocation, id, OP_NONE, true);
    PendingOperations.clearItem(OP_NEEDS_INSTALL, id);
  },

  /**
   * Removes an item's metadata in preparation for an upgrade-install.
   * @param   id
   *          The GUID of the item to uninstall.
   * @param   installLocation
   *          The nsIInstallLocation of the item
   */
  _finalizeUpgrade: function EM__finalizeUpgrade(id, installLocation) {
    // Retrieve the item properties *BEFORE* we clean the resource!
    var ds = this.datasource;

    var stagedFile = null;
    if ("getStageFile" in installLocation)
      stagedFile = installLocation.getStageFile(id);

    if (stagedFile)
      var installRDF = extractRDFFileToTempDir(stagedFile, FILE_INSTALL_MANIFEST, true);
    else
      installRDF = installLocation.getItemFile(id, FILE_INSTALL_MANIFEST);
    if (installRDF.exists()) {
      var installManifest = getInstallManifest(installRDF);
      if (installManifest) {
        var type = getAddonTypeFromInstallManifest(installManifest);
        var userDisabled = ds.getItemProperty(id, "userDisabled") == "true";

        // Clean the item resource
        ds.removeItemMetadata(id);
        // Now set up the properties on the item to mimic an item in its
        // "initial state" for installation.
        this._configureForthcomingItem(installManifest, id, installLocation,
                                       type);
        if (userDisabled)
          ds.setItemProperty(id, EM_R("userDisabled"), EM_L("true"));
      }
      if (stagedFile)
        installRDF.remove(false);
    }
    // Clear the op flag from the Pending Operations set. Do NOT clear op flag in
    // the startup cache since this may have been reset to OP_NEEDS_INSTALL by
    // |_configureForthcomingItem|.
    PendingOperations.clearItem(OP_NEEDS_UPGRADE, id);
  },

  /**
   * Completes an item's uninstallation.
   * @param   id
   *          The GUID of the item to uninstall.
   */
  _finalizeUninstall: function EM__finalizeUninstall(id) {
    var ds = this.datasource;

    var installLocation = this.getInstallLocation(id);
    if (!installLocation.itemIsManagedIndependently(id)) {
      try {
        // Having a callback that does nothing just causes the directory to be
        // removed.
        safeInstallOperation(id, installLocation,
                             { data: null, callback: function() { } });
      }
      catch (e) {
        ERROR("_finalizeUninstall: failed to remove directory for item: " + id +
              " at Install Location: " + installLocation.name + ", rolling back uninstall");
        var manifest = installLocation.getItemFile(id, "FILE_INSTALL_MANIFEST");
        // If there is no manifest then either the rollback failed, or there was
        // no manifest in the first place. Either way this item is now invalid
        // and we shouldn't try to re-install it.
        if (manifest.exists()) {
          // Removal of the files failed, reset the uninstalled flag and rewrite
          // the install manifests so this item's components are registered.
          // Clear the op flag from the Startup Cache
          StartupCache.put(installLocation, id, OP_NONE, true);
          var restartRequired = this.installRequiresRestart(id, ds.getItemProperty(id, "type"))
          this._updateManifests(restartRequired);
          return;
        }
      }
    }
    else if (installLocation.name == KEY_APP_PROFILE ||
             installLocation.name == KEY_APP_GLOBAL ||
             installLocation.name == KEY_APP_SYSTEM_USER) {
      // Check for a pointer file and remove it if it exists
      var pointerFile = installLocation.location.clone();
      pointerFile.append(id);
      if (pointerFile.exists() && !pointerFile.isDirectory())
        pointerFile.remove(false);
    }

    // Clean the item resource
    ds.removeItemMetadata(id);

    // Do this LAST since inferences are made about an item based on
    // what container it's in.
    ds.removeItemFromContainer(id);

    // Clear the op flag from the Startup Cache and the Pending Operations set.
    StartupCache.clearEntry(installLocation, id);
    PendingOperations.clearItem(OP_NEEDS_UNINSTALL, id);
  },

  /**
   * Uninstalls an item. If the uninstallation cannot be performed immediately
   * it is scheduled for the next restart.
   * @param   id
   *          The GUID of the item to uninstall.
   */
  uninstallItem: function EM_uninstallItem(id) {
    var ds = this.datasource;
    ds.updateDownloadState(PREFIX_ITEM_URI + id, null);
    if (!ds.isDownloadItem(id)) {
      var opType = ds.getItemProperty(id, "opType");
      var installLocation = this.getInstallLocation(id);
      // Removes any staged xpis for this item.
      if (opType == OP_NEEDS_UPGRADE || opType == OP_NEEDS_INSTALL) {
        var stageFile = installLocation.getStageFile(id);
        if (stageFile)
          installLocation.removeFile(stageFile);
      }
      // Addons with an opType of OP_NEEDS_INSTALL only have a staged xpi file
      // and are removed immediately since the uninstall can't be canceled.
      if (opType == OP_NEEDS_INSTALL) {
        ds.removeItemMetadata(id);
        ds.removeItemFromContainer(id);
        ds.updateVisibleList(id, null, true);
        StartupCache.clearEntry(installLocation, id);
        this._updateManifests(false);
      }
      else {
        if (opType == OP_NEEDS_UPGRADE)
          ds.setItemProperty(id, "newVersion", null);
        this._setOp(id, OP_NEEDS_UNINSTALL);
        var type = ds.getItemProperty(id, "type");
        var restartRequired = this.installRequiresRestart(id, type);
        if (!restartRequired) {
          this._finalizeUninstall(id);
          this._updateManifests(restartRequired);
        }
      }
    }
    else {
      // Bad download entry - uri is url, e.g. "http://www.foo.com/test.xpi"
      // ... just remove it from the list.
      ds.removeCorruptDLItem(id);
    }

    this._notifyAction(id, EM_ITEM_UNINSTALLED);
  },

  /* See nsIExtensionManager.idl */
  cancelInstallItem: function EM_cancelInstallItem(id) {
    var ds = this.datasource;
    var opType = ds.getItemProperty(id, "opType");
    if (opType != OP_NEEDS_UPGRADE && opType != OP_NEEDS_INSTALL)
      return;

    ds.updateDownloadState(PREFIX_ITEM_URI + id, null);
    var installLocation = this.getInstallLocation(id);
    // Removes any staged xpis for this item.
    var stageFile = installLocation.getStageFile(id);
    if (stageFile)
      installLocation.removeFile(stageFile);
    // Addons with an opType of OP_NEEDS_INSTALL only have a staged xpi file
    // and just need to be removed completely from the ds.
    if (opType == OP_NEEDS_INSTALL) {
      ds.removeItemMetadata(id);
      ds.removeItemFromContainer(id);
      ds.updateVisibleList(id, null, true);
      StartupCache.clearEntry(installLocation, id);
      this._updateManifests(false);
      this._notifyAction(id, EM_ITEM_CANCEL);
    }
    else {
      // Clear upgrade information and reset any request to enable/disable.
      ds.setItemProperty(id, EM_R("newVersion"), null);
      var appDisabled = ds.getItemProperty(id, "appDisabled");
      var userDisabled = ds.getItemProperty(id, "userDisabled");
      if (appDisabled == "true" || appDisabled == OP_NONE && userDisabled == OP_NONE) {
        this._setOp(id, OP_NONE);
        this._notifyAction(id, EM_ITEM_CANCEL);
      }
      else if (appDisabled == OP_NEEDS_DISABLE || userDisabled == OP_NEEDS_DISABLE) {
        this._setOp(id, OP_NEEDS_DISABLE);
        this._notifyAction(id, EM_ITEM_DISABLED);
      }
      else if (appDisabled == OP_NEEDS_ENABLE || userDisabled == OP_NEEDS_ENABLE) {
        this._setOp(id, OP_NEEDS_ENABLE);
        this._notifyAction(id, EM_ITEM_ENABLED);
      }
      else {
        this._setOp(id, OP_NONE);
        this._notifyAction(id, EM_ITEM_CANCEL);
      }
    }
  },

  /**
   * Cancels a pending uninstall of an item
   * @param   id
   *          The ID of the item.
   */
  cancelUninstallItem: function EM_cancelUninstallItem(id) {
    var ds = this.datasource;
    var appDisabled = ds.getItemProperty(id, "appDisabled");
    var userDisabled = ds.getItemProperty(id, "userDisabled");
    if (appDisabled == "true" || appDisabled == OP_NONE && userDisabled == OP_NONE) {
      this._setOp(id, OP_NONE);
      this._notifyAction(id, EM_ITEM_CANCEL);
    }
    else if (appDisabled == OP_NEEDS_DISABLE || userDisabled == OP_NEEDS_DISABLE) {
      this._setOp(id, OP_NEEDS_DISABLE);
      this._notifyAction(id, EM_ITEM_DISABLED);
    }
    else if (appDisabled == OP_NEEDS_ENABLE || userDisabled == OP_NEEDS_ENABLE) {
      this._setOp(id, OP_NEEDS_ENABLE);
      this._notifyAction(id, EM_ITEM_ENABLED);
    }
    else {
      this._setOp(id, OP_NONE);
      this._notifyAction(id, EM_ITEM_CANCEL);
    }
  },

  /**
   * Sets the pending operation for a visible item.
   * @param   id
   *          The GUID of the item
   * @param   op
   *          The name of the operation to be performed
   */
  _setOp: function EM__setOp(id, op) {
    var location = this.getInstallLocation(id);
    StartupCache.put(location, id, op, true);
    PendingOperations.addItem(op, { locationKey: location.name, id: id });
    var ds = this.datasource;
    if (op == OP_NEEDS_INSTALL || op == OP_NEEDS_UPGRADE)
      ds.updateDownloadState(PREFIX_ITEM_URI + id, "success");

    ds.updateProperty(id, "opType");
    ds.updateProperty(id, "updateable");
    ds.updateProperty(id, "satisfiesDependencies");
    var restartRequired = this.installRequiresRestart(id, ds.getItemProperty(id, "type"))
    this._updateDependentItemsForID(id);
    this._updateManifests(restartRequired);
  },

  /**
   * Note on appDisabled and userDisabled property arcs.
   * The appDisabled and userDisabled RDF property arcs are used to store
   * the pending operation for app disabling and user disabling for an item as
   * well as the user and app disabled status after the pending operation has
   * been completed upon restart. When the appDisabled value changes the value
   * of userDisabled is reset to prevent the state of widgets and status
   * messages from being in an incorrect state.
   */

  /**
   * Enables an item for the application (e.g. the item satisfies all
   * requirements like app compatibility for it to be enabled). The appDisabled
   * property arc will be removed if the item will be app disabled on next
   * restart to cancel the app disabled operation for the item otherwise the
   * property value will be set to OP_NEEDS_ENABLE. The item's pending
   * operations are then evaluated in order to set the operation to perform
   * and notify the observers if the operation has been changed.
   * See "Note on appDisabled and userDisabled property arcs" above.
   * @param   id
   *          The ID of the item to be enabled by the application.
   */
  _appEnableItem: function EM__appEnableItem(id) {
    var ds = this.datasource;
    var appDisabled = ds.getItemProperty(id, "appDisabled");
    if (appDisabled == OP_NONE || appDisabled == OP_NEEDS_ENABLE)
      return;

    var opType = ds.getItemProperty(id, "opType");
    var userDisabled = ds.getItemProperty(id, "userDisabled");
    // reset user disabled if it has a pending operation to prevent the ui
    // state from getting confused as to an item's current state.
    if (userDisabled == OP_NEEDS_DISABLE)
      ds.setItemProperty(id, EM_R("userDisabled"), null);
    else if (userDisabled == OP_NEEDS_ENABLE)
      ds.setItemProperty(id, EM_R("userDisabled"), EM_L("true"));

    if (appDisabled == OP_NEEDS_DISABLE)
      ds.setItemProperty(id, EM_R("appDisabled"), null);
    else if (appDisabled == "true")
      ds.setItemProperty(id, EM_R("appDisabled"), EM_L(OP_NEEDS_ENABLE));

    // Don't set a new operation when there is a pending uninstall operation.
    if (opType == OP_NEEDS_UNINSTALL) {
      this._updateDependentItemsForID(id);
      return;
    }

    var operation, action;
    // if this item is already enabled or user disabled don't set a pending
    // operation - instead immediately enable it and reset the operation type
    // if needed.
    if (appDisabled == OP_NEEDS_DISABLE || appDisabled == OP_NONE ||
        userDisabled == "true") {
      if (opType != OP_NONE) {
        operation = OP_NONE;
        action = EM_ITEM_CANCEL;
      }
    }
    else {
      if (opType != OP_NEEDS_ENABLE) {
        operation = OP_NEEDS_ENABLE;
        action = EM_ITEM_ENABLED;
      }
    }

    if (action) {
      this._setOp(id, operation);
      this._notifyAction(id, action);
    }
    else {
      ds.updateProperty(id, "satisfiesDependencies");
      this._updateDependentItemsForID(id);
    }
  },

  /**
   * Disables an item for the application (e.g. the item doesn't satisfy all
   * requirements like app compatibility for it to be enabled). The appDisabled
   * property arc will be set to true if the item will be app enabled on next
   * restart to cancel the app enabled operation for the item otherwise the
   * property value will be set to OP_NEEDS_DISABLE. The item's pending
   * operations are then evaluated in order to set the operation to perform
   * and notify the observers if the operation has been changed.
   * See "Note on appDisabled and userDisabled property arcs" above.
   * @param   id
   *          The ID of the item to be disabled by the application.
   */
  _appDisableItem: function EM__appDisableItem(id) {
    var ds = this.datasource;
    var appDisabled = ds.getItemProperty(id, "appDisabled");
    if (appDisabled == "true" || appDisabled == OP_NEEDS_DISABLE)
      return;

    var opType = ds.getItemProperty(id, "opType");
    var userDisabled = ds.getItemProperty(id, "userDisabled");

    // reset user disabled if it has a pending operation to prevent the ui
    // state from getting confused as to an item's current state.
    if (userDisabled == OP_NEEDS_DISABLE)
      ds.setItemProperty(id, EM_R("userDisabled"), null);
    else if (userDisabled == OP_NEEDS_ENABLE)
      ds.setItemProperty(id, EM_R("userDisabled"), EM_L("true"));

    if (appDisabled == OP_NEEDS_ENABLE || userDisabled == OP_NEEDS_ENABLE ||
        ds.getItemProperty(id, "userDisabled") == "true")
      ds.setItemProperty(id, EM_R("appDisabled"), EM_L("true"));
    else if (appDisabled == OP_NONE)
      ds.setItemProperty(id, EM_R("appDisabled"), EM_L(OP_NEEDS_DISABLE));

    // Don't set a new operation when there is a pending uninstall operation.
    if (opType == OP_NEEDS_UNINSTALL) {
      this._updateDependentItemsForID(id);
      return;
    }

    var operation, action;
    // if this item is already disabled don't set a pending operation - instead
    // immediately disable it and reset the operation type if needed.
    if (appDisabled == OP_NEEDS_ENABLE || appDisabled == "true" ||
        userDisabled == OP_NEEDS_ENABLE || userDisabled == "true") {
      if (opType != OP_NONE) {
        operation = OP_NONE;
        action = EM_ITEM_CANCEL;
      }
    }
    else {
      if (opType != OP_NEEDS_DISABLE) {
        operation = OP_NEEDS_DISABLE;
        action = EM_ITEM_DISABLED;
      }
    }

    if (action) {
      this._setOp(id, operation);
      this._notifyAction(id, action);
    }
    else {
      ds.updateProperty(id, "satisfiesDependencies");
      this._updateDependentItemsForID(id);
    }
  },

  /**
   * Sets an item to be enabled by the user. If the item is already enabled this
   * clears the needs-enable operation for the next restart.
   * See "Note on appDisabled and userDisabled property arcs" above.
   * @param   id
   *          The ID of the item to be enabled by the user.
   */
  enableItem: function EM_enableItem(id) {
    var ds = this.datasource;
    var opType = ds.getItemProperty(id, "opType");
    var appDisabled = ds.getItemProperty(id, "appDisabled");
    var userDisabled = ds.getItemProperty(id, "userDisabled");

    var operation, action;
    // if this item is already enabled don't set a pending operation - instead
    // immediately enable it and reset the operation type if needed.
    if (appDisabled == OP_NONE &&
        userDisabled == OP_NEEDS_DISABLE || userDisabled == OP_NONE) {
      if (userDisabled == OP_NEEDS_DISABLE)
        ds.setItemProperty(id, EM_R("userDisabled"), null);
      if (opType != OP_NONE) {
        operation = OP_NONE;
        action = EM_ITEM_CANCEL;
      }
    }
    else {
      if (userDisabled == "true")
        ds.setItemProperty(id, EM_R("userDisabled"), EM_L(OP_NEEDS_ENABLE));
      if (opType != OP_NEEDS_ENABLE) {
        operation = OP_NEEDS_ENABLE;
        action = EM_ITEM_ENABLED;
      }
    }

    if (action) {
      this._setOp(id, operation);
      this._notifyAction(id, action);
    }
    else {
      ds.updateProperty(id, "satisfiesDependencies");
      this._updateDependentItemsForID(id);
    }
  },

  /**
   * Sets an item to be disabled by the user. If the item is already disabled
   * this clears the needs-disable operation for the next restart.
   * See "Note on appDisabled and userDisabled property arcs" above.
   * @param   id
   *          The ID of the item to be disabled by the user.
   */
  disableItem: function EM_disableItem(id) {
    var ds = this.datasource;
    var opType = ds.getItemProperty(id, "opType");
    var appDisabled = ds.getItemProperty(id, "appDisabled");
    var userDisabled = ds.getItemProperty(id, "userDisabled");

    var operation, action;
    // if this item is already disabled don't set a pending operation - instead
    // immediately disable it and reset the operation type if needed.
    if (userDisabled == OP_NEEDS_ENABLE || userDisabled == "true" ||
        appDisabled == OP_NEEDS_ENABLE) {
      if (userDisabled != "true")
        ds.setItemProperty(id, EM_R("userDisabled"), EM_L("true"));
      if (opType != OP_NONE) {
        operation = OP_NONE;
        action = EM_ITEM_CANCEL;
      }
    }
    else {
      if (userDisabled == OP_NONE)
        ds.setItemProperty(id, EM_R("userDisabled"), EM_L(OP_NEEDS_DISABLE));
      if (opType != OP_NEEDS_DISABLE) {
        operation = OP_NEEDS_DISABLE;
        action = EM_ITEM_DISABLED;
      }
    }

    if (action) {
      this._setOp(id, operation);
      this._notifyAction(id, action);
    }
    else {
      ds.updateProperty(id, "satisfiesDependencies");
      this._updateDependentItemsForID(id);
    }
  },

  /**
   * Determines whether an item should be disabled by the application.
   * @param   id
   *          The ID of the item to check
   */
  _isUsableItem: function EM__isUsableItem(id) {
    var ds = this.datasource;
    /* If we're not compatibility checking or if the item is compatible
     * and if it isn't blocklisted and has all dependencies satisfied then
     * proceed to the security check */
    if ((!gCheckCompatibility || ds.getItemProperty(id, "compatible") == "true") &&
        ds.getItemProperty(id, "blocklisted") == "false" &&
        ds.getItemProperty(id, "satisfiesDependencies") == "true") {

      // appManaged items aren't updated so no need to check update security.
      if (ds.getItemProperty(id, "appManaged") == "true")
        return true;

      /* If we are not ignoring update security then check that the item has
       * a secure update mechanism */
      return (!gCheckUpdateSecurity ||
              ds.getItemProperty(id, "providesUpdatesSecurely") == "true");
    }
    return false;
  },

  /**
   * Sets an item's dependent items disabled state for the app based on whether
   * its dependencies are met and the item is compatible.
   * @param   id
   *          The ID of the item whose dependent items will be checked
   */
  _updateDependentItemsForID: function EM__updateDependentItemsForID(id) {
    var ds = this.datasource;
    var dependentItems = this.getDependentItemListForID(id, true, { });
    for (var i = 0; i < dependentItems.length; ++i) {
      var dependentID = dependentItems[i].id;
      ds.updateProperty(dependentID, "satisfiesDependencies");
      if (this._isUsableItem(dependentID))
        this._appEnableItem(dependentID);
      else
        this._appDisableItem(dependentID);
    }
  },

  /**
   * Notify observers of a change to an item that has been requested by the
   * user.
   */
  _notifyAction: function EM__notifyAction(id, reason) {
    gOS.notifyObservers(this.datasource.getItemForID(id),
                        EM_ACTION_REQUESTED_TOPIC, reason);
  },

  /**
   * See nsIExtensionManager.idl
   */
  update: function EM_update(items, itemCount, updateCheckType, listener,
                             appVersion, platformVersion) {
    for (i = 0; i < itemCount; ++i) {
      var currItem = items[i];
      if (!currItem)
        throw Cr.NS_ERROR_ILLEGAL_VALUE;
    }

    if (items.length == 0)
      items = this.getItemList(Ci.nsIUpdateItem.TYPE_ANY, { });

    var updater = new ExtensionItemUpdater(this);
    updater.checkForUpdates(items, items.length, updateCheckType, listener,
                            appVersion, platformVersion);
  },

  /**
   * See nsIExtensionManager.idl
   */
  updateAndGetNewBlocklistedItems: function EM_updateAndGetNewBlocklistedItems(itemCount) {
    if (!gBlocklist)
      gBlocklist = Cc["@mozilla.org/extensions/blocklist;1"].
                   getService(Ci.nsIBlocklistService);

    var list = [];
    var ds = this.datasource;
    var items = this.getItemList(Ci.nsIUpdateItem.TYPE_ANY, { });
    for (var i = 0; i < items.length; ++i) {
      var id = items[i].id;

      // Get whether the add-on is currently disabled or set to be disabled.
      var appDisabled = (ds.getItemProperty(id, "appDisabled") == "true" ||
                         ds.getItemProperty(id, "appDisabled") == OP_NEEDS_DISABLE);
      var userDisabled = (ds.getItemProperty(id, "userDisabled") == "true" ||
                          ds.getItemProperty(id, "userDisabled") == OP_NEEDS_DISABLE);
      var usable = this._isUsableItem(id);
      var state = gBlocklist.getAddonBlocklistState(items[i].id, items[i].version);

      // We only return items that are now blocked or to be warned about and aren't
      // already disabled for some reason.
      if (!appDisabled && !userDisabled && state != Ci.nsIBlocklistService.STATE_NOT_BLOCKED)
        list.push(items[i]);

      // Update the appDisabled status based on the new blocked state
      if (usable)
        this._appEnableItem(id);
      else
        this._appDisableItem(id);

      // If the item was appDisabled and is now usable then it is something
      // that is no longer hard blocked. If it is still to be warned about then
      // just user disable it.
      if (appDisabled && usable && !userDisabled &&
          state == Ci.nsIBlocklistService.STATE_SOFTBLOCKED)
        this.disableItem(id);

      ds.updateProperty(id, "blocklisted");
      ds.updateProperty(id, "blocklistedsoft");
    }

    itemCount.value = list.length;
    return list;
  },

  /**
   * @returns An enumeration of all registered Install Locations.
   */
  get installLocations () {
    return InstallLocations.enumeration;
  },

  /**
   * Gets the Install Location where a visible Item is stored.
   * @param   id
   *          The GUID of the item to locate an Install Location for.
   * @returns The Install Location object where the item is stored.
   */
  getInstallLocation: function EM_getInstallLocation(id) {
    var key = this.datasource.visibleItems[id];
    return key ? InstallLocations.get(this.datasource.visibleItems[id]) : null;
  },

  /**
   * Gets a nsIUpdateItem for the item with the specified id.
   * @param   id
   *          The GUID of the item to construct a nsIUpdateItem for.
   * @returns The nsIUpdateItem representing the item.
   */
  getItemForID: function EM_getItemForID(id) {
    return this.datasource.getItemForID(id);
  },

  /**
   * Retrieves a list of installed nsIUpdateItems of items that are dependent
   * on another item.
   * @param   id
   *          The ID of the item that other items depend on.
   * @param   includeDisabled
   *          Whether to include disabled items in the set returned.
   * @param   countRef
   *          The XPCJS reference to the number of items returned.
   * @returns An array of installed nsIUpdateItems that depend on the item
   *          specified by the id parameter.
   */
  getDependentItemListForID: function EM_getDependentItemListForID(id,
                                                                   includeDisabled,
                                                                   countRef) {
    return this.datasource.getDependentItemListForID(id, includeDisabled, countRef);
  },

  /* See nsIExtensionManager.idl */
  getItemList: function EM_getItemList(type, countRef) {
    return this.datasource.getItemList(type, countRef);
  },

  /* See nsIExtensionManager.idl */
  getIncompatibleItemList: function EM_getIncompatibleItemList(id, appVersion,
                                                               platformVersion,
                                                               type,
                                                               includeDisabled,
                                                               countRef) {
    var items = this.datasource.getIncompatibleItemList(id, appVersion ? appVersion : undefined,
                                                        platformVersion ? platformVersion : undefined,
                                                        type, includeDisabled);
    countRef.value = items.length;
    return items;
  },

  /**
   * Move an Item to the index of another item in its container.
   * @param   movingID
   *          The ID of the item to be moved.
   * @param   destinationID
   *          The ID of an item to move another item to.
   */
  moveToIndexOf: function EM_moveToIndexOf(movingID, destinationID) {
    this.datasource.moveToIndexOf(movingID, destinationID);
  },

  /**
   * Sorts addons of the specified type by the specified property starting from
   * the top of their container. If the addons are already sorted then no action
   * is performed.
   * @param   type
   *          The nsIUpdateItem type of the items to sort.
   * @param   propertyName
   *          The RDF property name used for sorting.
   * @param   isAscending
   *          true to sort ascending and false to sort descending
   */
  sortTypeByProperty: function EM_sortTypeByProperty(type, propertyName, isAscending) {
    this.datasource.sortTypeByProperty(type, propertyName, isAscending);
  },

  /////////////////////////////////////////////////////////////////////////////
  // Downloads
  _transactions: [],
  _downloadCount: 0,
  _compatibilityCheckCount: 0,

  /**
   * Ask the user if they really want to quit the application, since this will
   * cancel one or more Extension/Theme downloads.
   * @param   subject
   *          A nsISupportsPRBool which this function sets to false if the user
   *          wishes to cancel all active downloads and quit the application,
   *          false otherwise.
   */
  _confirmCancelDownloadsOnQuit: function EM__confirmCancelDownloadsOnQuit(subject) {
    // If user has already dismissed quit request, then do nothing
    if ((subject instanceof Ci.nsISupportsPRBool) && subject.data)
      return;

    if (this._downloadCount > 0) {
      // The observers will be notified again after this so set the download
      // count to 0 to prevent this dialog from being displayed again.
      this._downloadCount = 0;
      var result;
//@line 5673 "e:\builds\moz2_slave\mozilla-1.9.1-win32-xulrunner\build\toolkit\mozapps\extensions\src\nsExtensionManager.js.in"
      result = this._confirmCancelDownloads(this._downloadCount,
                                            "quitCancelDownloadsAlertTitle",
                                            "quitCancelDownloadsAlertMsgMultiple",
                                            "quitCancelDownloadsAlertMsg",
                                            "dontQuitButtonWin");
//@line 5685 "e:\builds\moz2_slave\mozilla-1.9.1-win32-xulrunner\build\toolkit\mozapps\extensions\src\nsExtensionManager.js.in"
      if (subject instanceof Ci.nsISupportsPRBool)
        subject.data = result;
    }
  },

  /**
   * Ask the user if they really want to go offline, since this will cancel
   * one or more Extension/Theme downloads.
   * @param   subject
   *          A nsISupportsPRBool which this function sets to false if the user
   *          wishes to cancel all active downloads and go offline, false
   *          otherwise.
   */
  _confirmCancelDownloadsOnOffline: function EM__confirmCancelDownloadsOnOffline(subject) {
    if (this._downloadCount > 0) {
      result = this._confirmCancelDownloads(this._downloadCount,
                                            "offlineCancelDownloadsAlertTitle",
                                            "offlineCancelDownloadsAlertMsgMultiple",
                                            "offlineCancelDownloadsAlertMsg",
                                            "dontGoOfflineButton");
      if (subject instanceof Ci.nsISupportsPRBool)
        subject.data = result;
    }
  },

  /**
   * Ask the user whether or not they wish to cancel the Extension/Theme
   * downloads which are currently under way.
   * @param   count
   *          The number of active downloads.
   * @param   title
   *          The key of the title for the message box to be displayed
   * @param   cancelMessageMultiple
   *          The key of the message to be displayed in the message box
   *          when there are > 1 active downloads.
   * @param   cancelMessageSingle
   *          The key of the message to be displayed in the message box
   *          when there is just one active download.
   * @param   dontCancelButton
   *          The key of the label to be displayed on the "Don't Cancel
   *          Downloads" button.
   */
  _confirmCancelDownloads: function EM__confirmCancelDownloads(count, title,
                                                               cancelMessageMultiple,
                                                               cancelMessageSingle,
                                                               dontCancelButton) {
    var bundle = BundleManager.getBundle(URI_DOWNLOADS_PROPERTIES);
    var title = bundle.GetStringFromName(title);
    var message, quitButton;
    if (count > 1) {
      message = bundle.formatStringFromName(cancelMessageMultiple, [count], 1);
      quitButton = bundle.formatStringFromName("cancelDownloadsOKTextMultiple", [count], 1);
    }
    else {
      message = bundle.GetStringFromName(cancelMessageSingle);
      quitButton = bundle.GetStringFromName("cancelDownloadsOKText");
    }
    var dontQuitButton = bundle.GetStringFromName(dontCancelButton);

    var wm = Cc["@mozilla.org/appshell/window-mediator;1"].
             getService(Ci.nsIWindowMediator);
    var win = wm.getMostRecentWindow("Extension:Manager");
    const nsIPromptService = Ci.nsIPromptService;
    var ps = Cc["@mozilla.org/embedcomp/prompt-service;1"].
             getService(nsIPromptService);
    var flags = (nsIPromptService.BUTTON_TITLE_IS_STRING * nsIPromptService.BUTTON_POS_0) +
                (nsIPromptService.BUTTON_TITLE_IS_STRING * nsIPromptService.BUTTON_POS_1);
    var rv = ps.confirmEx(win, title, message, flags, quitButton, dontQuitButton, null, null, { });
    return rv == 1;
  },

  /* See nsIExtensionManager.idl */
  addDownloads: function EM_addDownloads(items, itemCount, manager) {
    if (itemCount == 0)
      throw Cr.NS_ERROR_ILLEGAL_VALUE;

    for (i = 0; i < itemCount; ++i) {
      var currItem = items[i];
      if (!currItem)
        throw Cr.NS_ERROR_ILLEGAL_VALUE;
    }

    var ds = this.datasource;
    // Add observers only if they aren't already added for an active download
    if (this._downloadCount == 0) {
      gOS.addObserver(this, "offline-requested", false);
      gOS.addObserver(this, "quit-application-requested", false);
    }
    this._downloadCount += itemCount;

    var urls = [];
    var hashes = [];
    var txnID = Math.round(Math.random() * 100);
    var txn = new ItemDownloadTransaction(this, txnID);
    for (var i = 0; i < itemCount; ++i) {
      var currItem = items[i];

      txn.addDownload(currItem);
      urls.push(currItem.xpiURL);
      hashes.push(currItem.xpiHash ? currItem.xpiHash : null);
      // if this is an update remove the update metadata to prevent it from
      // being updated during an install.
      if (!manager) {
        var id = currItem.id
        ds.setItemProperties(id, {
          availableUpdateURL: null,
          availableUpdateHash: null,
          availableUpdateVersion: null,
          availableUpdateInfo: null
        });
        ds.updateProperty(id, "availableUpdateURL");
        ds.updateProperty(id, "updateable");
      }
      var id = !manager ? PREFIX_ITEM_URI + currItem.id : currItem.xpiURL;
      ds.updateDownloadState(id, "waiting");
    }
    this._transactions.push(txn);

    if (manager) {
      // XPIManager initiated -- let it know we're ready
      manager.observe(txn, "xpinstall-progress", "open");
    }
    else {
      // Initiate an install from chrome
      var xpimgr = Cc["@mozilla.org/xpinstall/install-manager;1"].
                   createInstance(Ci.nsIXPInstallManager);
      xpimgr.initManagerWithHashes(urls, hashes, urls.length, txn);
    }
  },

  /**
   * Download Operation State has changed from one to another.
   *
   * The nsIXPIProgressDialog implementation in the download transaction object
   * forwards notifications through these methods which we then pass on to any
   * front end objects implementing nsIExtensionDownloadListener that
   * are listening. We maintain the master state of download operations HERE,
   * not in the front end, because if the user closes the extension or theme
   * managers during the downloads we need to maintain state and not terminate
   * the download/install process.
   *
   * @param   transaction
   *          The ItemDownloadTransaction object receiving the download
   *          notifications from XPInstall.
   * @param   addon
   *          An object representing nsIUpdateItem for the addon being updated
   * @param   state
   *          The state we are entering
   * @param   value
   *          ???
   */
  onStateChange: function EM_onStateChange(transaction, addon, state, value) {
    var ds = this.datasource;
    var id = addon.id != addon.xpiURL ? PREFIX_ITEM_URI + addon.id : addon.xpiURL;
    const nsIXPIProgressDialog = Ci.nsIXPIProgressDialog;
    switch (state) {
    case nsIXPIProgressDialog.DOWNLOAD_START:
      ds.updateDownloadState(id, "downloading");
      for (var i = 0; i < this._installListeners.length; ++i)
        this._installListeners[i].onDownloadStarted(addon);
      break;
    case nsIXPIProgressDialog.DOWNLOAD_DONE:
      for (var i = 0; i < this._installListeners.length; ++i)
        this._installListeners[i].onDownloadEnded(addon);
      break;
    case nsIXPIProgressDialog.INSTALL_START:
      ds.updateDownloadState(id, "finishing");
      ds.updateDownloadProgress(id, null);
      break;
    case nsIXPIProgressDialog.INSTALL_DONE:
      --this._downloadCount;
      // From nsInstall.h
      // SUCCESS        = 0
      // USER_CANCELLED = -210
      if (value != 0 && value != -210 && id != addon.xpiURL) {
        ds.updateDownloadState(id, "failure");
        ds.updateDownloadProgress(id, null);
      }
      transaction.removeDownload(addon.xpiURL);
      // A successful install will be passing notifications via installItemFromFile
      if (value != 0) {
        for (var i = 0; i < this._installListeners.length; ++i)
          this._installListeners[i].onInstallEnded(addon, value);
      }
      break;
    case nsIXPIProgressDialog.DIALOG_CLOSE:
      for (var i = 0; i < this._transactions.length; ++i) {
        if (this._transactions[i].id == transaction.id) {
          this._transactions.splice(i, 1);
          // Remove the observers when all transactions have completed.
          if (this._transactions.length == 0) {
            gOS.removeObserver(this, "offline-requested");
            gOS.removeObserver(this, "quit-application-requested");

            // If there are no compatibility checks running then the install
            // operations are complete.
            if (this._compatibilityCheckCount == 0) {
              for (var i = 0; i < this._installListeners.length; ++i)
                this._installListeners[i].onInstallsCompleted();
            }
          }
          break;
        }
      }
      // Remove any remaining downloads from this transaction
      transaction.removeAllDownloads();
      break;
    }
  },

  onProgress: function EM_onProgress(addon, value, maxValue) {
    for (var i = 0; i < this._installListeners.length; ++i)
      this._installListeners[i].onDownloadProgress(addon, value, maxValue);

    var id = addon.id != addon.xpiURL ? PREFIX_ITEM_URI + addon.id : addon.xpiURL;
    var progress = Math.round((value / maxValue) * 100);
    this.datasource.updateDownloadProgress(id, progress);
  },

  _installListeners: [],
  addInstallListener: function EM_addInstallListener(listener) {
    for (var i = 0; i < this._installListeners.length; ++i) {
      if (this._installListeners[i] == listener)
        return i;
    }
    this._installListeners.push(listener);
    return this._installListeners.length - 1;
  },

  removeInstallListenerAt: function EM_removeInstallListenerAt(index) {
    this._installListeners.splice(index, 1);
  },

  /**
   * The Extensions RDF Datasource
   */
  _ds: null,
  _ptr: null,

  /**
   * Loads the Extensions Datasource. This should not be called unless:
   * - a piece of Extensions UI is being shown, or
   * - on startup and there has been a change to an Install Location
   * ... it should NOT be called on every startup!
   */
  _ensureDS: function EM__ensureDS() {
    if (!this._ds) {
      this._ds = new ExtensionsDataSource(this);
      if (this._ds) {
        this._ds.loadExtensions();
        this._ptr = getContainer(this._ds, this._ds._itemRoot).DataSource;
        gRDF.RegisterDataSource(this._ptr, true);
      }
    }
  },

  /**
   * See nsIExtensionManager.idl
   */
  get datasource() {
    this._ensureDS();
    return this._ds;
  },

  // nsIClassInfo
  flags: Ci.nsIClassInfo.SINGLETON,
  implementationLanguage: Ci.nsIProgrammingLanguage.JAVASCRIPT,
  getHelperForLanguage: function(language) null,
  getInterfaces: function(count) {
    var interfaces = [Ci.nsIExtensionManager, Ci.nsIObserver];
    count.value = interfaces.length;
    return interfaces;
  },

  classDescription: "Extension Manager",
  contractID: "@mozilla.org/extensions/manager;1",
  classID: Components.ID("{8A115FAA-7DCB-4e8f-979B-5F53472F51CF}"),
  _xpcom_categories: [{ category: "profile-after-change" }],
  _xpcom_factory: {
    createInstance: function(outer, iid) {
      if (outer != null)
        throw Cr.NS_ERROR_NO_AGGREGATION;
  
      if (!gEmSingleton)
        gEmSingleton = new ExtensionManager();
      return gEmSingleton.QueryInterface(iid);
    }
  },
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIExtensionManager,
                                         Ci.nsITimerCallback,
                                         Ci.nsIObserver,
                                         Ci.nsIClassInfo])
};

/**
 * This object implements nsIXPIProgressDialog and represents a collection of
 * XPI/JAR download and install operations. There is one
 * ItemDownloadTransaction per back-end XPInstallManager object. We maintain
 * a collection of separate transaction objects because it's possible to have
 * multiple separate XPInstall download/install operations going on
 * simultaneously, each with its own XPInstallManager instance. For instance
 * you could start downloading two extensions and then download a theme. Each
 * of these operations would open the appropriate FE and have to be able to
 * track each operation independently.
 *
 * @constructor
 * @param   manager
 *          The extension manager creating this transaction
 * @param   id
 *          The integer identifier of this transaction
 */
function ItemDownloadTransaction(manager, id) {
  this._manager = manager;
  this._downloads = [];
  this.id = id;
}
ItemDownloadTransaction.prototype = {
  _manager    : null,
  _downloads  : [],
  id          : -1,

  /**
   * Add a download to this transaction
   * @param   addon
   *          An object implementing nsIUpdateItem for the item to be downloaded
   */
  addDownload: function ItemDownloadTransaction_addDownload(addon) {
    this._downloads.push({ addon: addon, waiting: true });
    this._manager.datasource.addDownload(addon);
  },

  /**
   * Removes a download from this transaction
   * @param   url
   *          The URL to remove
   */
  removeDownload: function ItemDownloadTransaction_removeDownload(url) {
    this._manager.datasource.removeDownload(url);
  },

  /**
   * Remove all downloads from this transaction
   */
  removeAllDownloads: function ItemDownloadTransaction_removeAllDownloads() {
    for (var i = 0; i < this._downloads.length; ++i) {
      var addon = this._downloads[i].addon;
      this.removeDownload(addon.xpiURL);
    }
  },

  /**
   * Determine if this transaction is handling the download of a url.
   * @param   url
   *          The URL to look for
   * @returns true if this transaction is downloading the supplied url.
   */
  containsURL: function ItemDownloadTransaction_containsURL(url) {
    for (var i = 0; i < this._downloads.length; ++i) {
      if (this._downloads[i].addon.xpiURL == url)
        return true;
    }
    return false;
  },

  /**
   * See nsIXPIProgressDialog.idl
   */
  onStateChange: function ItemDownloadTransaction_onStateChange(index, state, value) {
    this._manager.onStateChange(this, this._downloads[index].addon,
                                state, value);
  },

  /**
   * See nsIXPIProgressDialog.idl
   */
  onProgress: function ItemDownloadTransaction_onProgress(index, value, maxValue) {
    this._manager.onProgress(this._downloads[index].addon, value, maxValue);
  },

  QueryInterface: XPCOMUtils.generateQI([Ci.nsIXPIProgressDialog])
};

/**
 * A listener object that watches the background update check and notifies the
 * user of any updates found.
 */
function BackgroundUpdateCheckListener(datasource) {
  this._emDS = datasource;
}
BackgroundUpdateCheckListener.prototype = {
  _updateCount: 0,
  _emDS: null,

  // nsIObserver implementation
  observe: function BackgroundUpdateListener_observe(aSubject, aTopic, aData) {
    if (aTopic != "alertclickcallback")
      return;

    var wm = Cc["@mozilla.org/appshell/window-mediator;1"].
             getService(Ci.nsIWindowMediator);
    var win = wm.getMostRecentWindow("Extension:Manager");
    if (win) {
      win.focus();
      win.showView("updates");
      // Don't show the update notification on next startup
      gPref.setBoolPref(PREF_UPDATE_NOTIFYUSER, false);
    }
    else {
      const EMURL = "chrome://mozapps/content/extensions/extensions.xul";
      const EMFEATURES = "chrome,menubar,extra-chrome,toolbar,dialog=no,resizable";

      var ww = Cc["@mozilla.org/embedcomp/window-watcher;1"].
               getService(Ci.nsIWindowWatcher);
      var param = Cc["@mozilla.org/supports-array;1"].
                  createInstance(Ci.nsISupportsArray);
      var arg = Cc["@mozilla.org/supports-string;1"].
                createInstance(Ci.nsISupportsString);
      arg.data = "updates";
      param.AppendElement(arg);
      ww.openWindow(null, EMURL, null, EMFEATURES, param);
    }
  },
  
  // nsIAddonUpdateCheckListener implementation
  onUpdateStarted: function BackgroundUpdateListener_onUpdateStarted() {
  },

  onUpdateEnded: function BackgroundUpdateListener_onUpdateEnded() {
    if (this._updateCount > 0 && Cc["@mozilla.org/alerts-service;1"]) {
      var extensionStrings = BundleManager.getBundle(URI_EXTENSIONS_PROPERTIES);
      var title = extensionStrings.GetStringFromName("updateNotificationTitle");
      var text;
      if (this._updateCount > 1)
        text = extensionStrings.formatStringFromName("multipleUpdateNotificationText",
                                                     [BundleManager.appName, this._updateCount], 2);
      else
        text = extensionStrings.formatStringFromName("updateNotificationText",
                                                     [BundleManager.appName], 1);

      try {
        var notifier = Cc["@mozilla.org/alerts-service;1"].
                       getService(Ci.nsIAlertsService);
        notifier.showAlertNotification(URI_GENERIC_ICON_XPINSTALL,
                                       title, text, true, "", this);
      }
      catch (e) {
        LOG("Failed to retrieve alerts service, probably an unsupported " +
            "platform - " + e);
      }
    }
  },

  onAddonUpdateStarted: function BackgroundUpdateListener_onAddonUpdateStarted(item) {
  },

  onAddonUpdateEnded: function BackgroundUpdateListener_onAddonUpdateEnded(item, status) {
    if (status == Ci.nsIAddonUpdateCheckListener.STATUS_UPDATE) {
      var lastupdate = this._emDS.getItemProperty(item.id, "availableUpdateVersion");
      if (lastupdate != item.version) {
        gPref.setBoolPref(PREF_UPDATE_NOTIFYUSER, true);
        this._updateCount++;
      }
    }
  }
};


/**
 * A listener object to the update check process that routes notifications to
 * the right places and keeps the datasource up to date.
 */
function AddonUpdateCheckListener(listener, datasource) {
  this._listener = listener;
  this._ds = datasource;
}
AddonUpdateCheckListener.prototype = {
  _listener: null,
  _ds: null,

  onUpdateStarted: function AddonUpdateListener_onUpdateStarted() {
    if (this._listener)
      this._listener.onUpdateStarted();
    this._ds.onUpdateStarted();
  },

  onUpdateEnded: function AddonUpdateListener_onUpdateEnded() {
    if (this._listener)
      this._listener.onUpdateEnded();
    this._ds.onUpdateEnded();
  },

  onAddonUpdateStarted: function AddonUpdateListener_onAddonUpdateStarted(addon) {
    if (this._listener)
      this._listener.onAddonUpdateStarted(addon);
    this._ds.onAddonUpdateStarted(addon);
  },

  onAddonUpdateEnded: function AddonUpdateListener_onAddonUpdateEnded(addon, status) {
    if (this._listener)
      this._listener.onAddonUpdateEnded(addon, status);
    this._ds.onAddonUpdateEnded(addon, status);
  }
};

///////////////////////////////////////////////////////////////////////////////
//
// ExtensionItemUpdater
//
function ExtensionItemUpdater(aEM)
{
  this._emDS = aEM._ds;
  this._em = aEM;

  getVersionChecker();
}

ExtensionItemUpdater.prototype = {
  _emDS               : null,
  _em                 : null,
  _updateCheckType    : 0,
  _items              : [],
  _listener           : null,

  /* ExtensionItemUpdater
//@line 6235 "e:\builds\moz2_slave\mozilla-1.9.1-win32-xulrunner\build\toolkit\mozapps\extensions\src\nsExtensionManager.js.in"
  */
  checkForUpdates: function ExtensionItemUpdater_checkForUpdates(aItems,
                                                                 aItemCount,
                                                                 aUpdateCheckType,
                                                                 aListener,
                                                                 aAppVersion,
                                                                 aPlatformVersion) {
    if (aUpdateCheckType == Ci.nsIExtensionManager.UPDATE_NOTIFY_NEWVERSION) {
      this._listener = aListener;
      this._appVersion = aAppVersion ? aAppVersion : gApp.version;
      this._platformVersion = aPlatformVersion ? aPlatformVersion
                                               : gApp.platformVersion;
    }
    else {
      this._listener = new AddonUpdateCheckListener(aListener, this._emDS);
      this._appVersion = gApp.version;
      this._platformVersion = gApp.platformVersion;
    }

    if (this._listener)
      this._listener.onUpdateStarted();
    this._updateCheckType = aUpdateCheckType;
    this._items = aItems;
    this._responseCount = aItemCount;

    // This is the number of extensions/themes/etc that we found updates for.
    this._updateCount = 0;

    for (var i = 0; i < aItemCount; ++i) {
      var e = this._items[i];
      if (this._listener)
        this._listener.onAddonUpdateStarted(e);
      (new RDFItemUpdater(this)).checkForUpdates(e, aUpdateCheckType);
    }

    if (this._listener && aItemCount == 0)
      this._listener.onUpdateEnded();
  },

  /////////////////////////////////////////////////////////////////////////////
  // ExtensionItemUpdater
  _applyVersionUpdates: function ExtensionItemUpdater__applyVersionUpdates(aLocalItem,
                                                                           aRemoteItem) {
    var targetAppInfo = this._emDS.getTargetApplicationInfo(aLocalItem.id, this._emDS);
    // If targetAppInfo is null this is for a new install. If the local item's
    // maxVersion does not equal the targetAppInfo maxVersion then this is for
    // an upgrade. In both of these cases return true if the remotely specified
    // maxVersion is greater than the local item's maxVersion.
    if (!targetAppInfo ||
        gVersionChecker.compare(aLocalItem.maxAppVersion, targetAppInfo.maxVersion) != 0) {
      if (gVersionChecker.compare(aLocalItem.maxAppVersion, aRemoteItem.maxAppVersion) < 0)
        return true;
      else
        return false;
    }

    if (gVersionChecker.compare(targetAppInfo.maxVersion, aRemoteItem.maxAppVersion) < 0) {
      // Remotely specified maxVersion is newer than the maxVersion
      // for the installed Extension. Apply that change to the datasources.
      this._emDS.setTargetApplicationInfo(aLocalItem.id,
                                          aRemoteItem.targetAppID,
                                          aRemoteItem.minAppVersion,
                                          aRemoteItem.maxAppVersion,
                                          null);

      // If we got here through |checkForMismatches|, this extension has
      // already been disabled, re-enable it.
      var op = StartupCache.entries[aLocalItem.installLocationKey][aLocalItem.id].op;
      if (op == OP_NEEDS_DISABLE ||
          this._emDS.getItemProperty(aLocalItem.id, "appDisabled") == "true")
        this._em._appEnableItem(aLocalItem.id);
      return true;
    }
    else if (this._updateCheckType == Ci.nsIExtensionManager.UPDATE_SYNC_COMPATIBILITY)
      this._emDS.setTargetApplicationInfo(aLocalItem.id,
                                          aRemoteItem.targetAppID,
                                          aRemoteItem.minAppVersion,
                                          aRemoteItem.maxAppVersion,
                                          null);
    return false;
  },

  /**
   * Checks whether a discovered update is valid for install
   * @param   aLocalItem
   *          The already installed nsIUpdateItem that the update is for
   * @param   aRemoteItem
   *          The nsIUpdateItem we are trying to update to
   * @param   aUpdateCheckType
   *          The type of update check being performed
   *
   * @returns true if the item is compatible and is not blocklisted.
   *          false if the item is not compatible or is blocklisted.
   */
  _isValidUpdate: function _isValidUpdate(aLocalItem, aRemoteItem, aUpdateCheckType) {
    var appExtensionsVersion = (aRemoteItem.targetAppID != TOOLKIT_ID) ?
                               this._appVersion :
                               this._platformVersion;

    var min = aRemoteItem.minAppVersion;
    var max = aRemoteItem.maxAppVersion;
    // Check if the update will only run on a newer version of the application.
    if (!min || gVersionChecker.compare(appExtensionsVersion, min) < 0)
      return false;

    // Check if the update will only run on an older version of the application.
    if (!max || gVersionChecker.compare(appExtensionsVersion, max) > 0)
      return false;

    // Ignore the blocklist for compatibility only checks.
    if (aUpdateCheckType != Ci.nsIExtensionManager.UPDATE_CHECK_COMPATIBILITY) {
      if (!gBlocklist)
        gBlocklist = Cc["@mozilla.org/extensions/blocklist;1"].
                     getService(Ci.nsIBlocklistService);
      // Denies updates that are hard blocked, soft blocked items will be warned
      // about during the install.
      if (gBlocklist.isAddonBlocklisted(aLocalItem.id, aRemoteItem.version,
                                        this._appVersion, this._platformVersion))
        return false;
    }

    return true;
  },

  checkForDone: function ExtensionItemUpdater_checkForDone(item, status) {
    if (this._listener) {
      try {
        this._listener.onAddonUpdateEnded(item, status);
      }
      catch (e) {
        LOG("ExtensionItemUpdater:checkForDone: Failure in listener's onAddonUpdateEnded: " + e);
      }
    }
    if (--this._responseCount == 0 && this._listener) {
      try {
        this._listener.onUpdateEnded();
      }
      catch (e) {
        LOG("ExtensionItemUpdater:checkForDone: Failure in listener's onUpdateEnded: " + e);
      }
    }
  },
};

/**
 * Replaces %...% strings in an addon url (update and updateInfo) with
 * appropriate values.
 * @param   aItem
 *          The nsIUpdateItem representing the item
 * @param   aURI
 *          The uri to escape
 * @param   aDS
 *          The extensions datasource
 *
 * @returns the appropriately escaped uri.
 */
function escapeAddonURI(aItem, aAppVersion, aURI, aDS)
{
  var itemStatus = "userEnabled";
  if (aDS.getItemProperty(aItem.id, "userDisabled") == "true" ||
      aDS.getItemProperty(aItem.id, "userDisabled") == OP_NEEDS_ENABLE)
    itemStatus = "userDisabled";
  else if (aDS.getItemProperty(aItem.id, "type") == Ci.nsIUpdateItem.TYPE_THEME) {
    var currentSkin = gPref.getCharPref(PREF_GENERAL_SKINS_SELECTEDSKIN);
    if (aDS.getItemProperty(aItem.id, "internalName") != currentSkin)
      itemStatus = "userDisabled";
  }

  if (aDS.getItemProperty(aItem.id, "compatible") == "false")
    itemStatus += ",incompatible";
  if (aDS.getItemProperty(aItem.id, "blocklisted") == "true")
    itemStatus += ",blocklisted";
  if (aDS.getItemProperty(aItem.id, "satisfiesDependencies") == "false")
    itemStatus += ",needsDependencies";

  aURI = aURI.replace(/%ITEM_ID%/g, aItem.id);
  aURI = aURI.replace(/%ITEM_VERSION%/g, aItem.version);
  aURI = aURI.replace(/%ITEM_MAXAPPVERSION%/g, aItem.maxAppVersion);
  aURI = aURI.replace(/%ITEM_STATUS%/g, itemStatus);
  aURI = aURI.replace(/%APP_ID%/g, gApp.ID);
  aURI = aURI.replace(/%APP_VERSION%/g, aAppVersion ? aAppVersion : gApp.version);
  aURI = aURI.replace(/%REQ_VERSION%/g, REQ_VERSION);
  aURI = aURI.replace(/%APP_OS%/g, gOSTarget);
  aURI = aURI.replace(/%APP_ABI%/g, gXPCOMABI);
  aURI = aURI.replace(/%APP_LOCALE%/g, gLocale);
  aURI = aURI.replace(/%CURRENT_APP_VERSION%/g, gApp.version);

  // Replace custom parameters (names of custom parameters must have at
  // least 3 characters to prevent lookups for something like %D0%C8)
  var catMan = null;
  aURI = aURI.replace(/%(\w{3,})%/g, function(match, param) {
    if (!catMan) {
      catMan = Cc["@mozilla.org/categorymanager;1"].
               getService(Ci.nsICategoryManager);
    }

    try {
      var contractID = catMan.getCategoryEntry(CATEGORY_UPDATE_PARAMS, param);
      var paramHandler = Cc[contractID].
                         getService(Ci.nsIPropertyBag2);
      return paramHandler.getPropertyAsAString(param);
    }
    catch(e) {
      return match;
    }
  });

  // escape() does not properly encode + symbols in any embedded FVF strings.
  return aURI.replace(/\+/g, "%2B");
}

function RDFItemUpdater(aUpdater) {
  this._updater = aUpdater;
}

RDFItemUpdater.prototype = {
  _updater            : null,
  _updateCheckType    : 0,
  _item               : null,

  checkForUpdates: function RDFItemUpdater_checkForUpdates(aItem, aUpdateCheckType) {
    // A preference setting can disable updating for this item
    try {
      if (!gPref.getBoolPref(PREF_EM_ITEM_UPDATE_ENABLED.replace(/%UUID%/, aItem.id))) {
        var status = Ci.nsIAddonUpdateCheckListener.STATUS_DISABLED;
        this._updater.checkForDone(aItem, status);
        return;
      }
    }
    catch (e) { }

    // Items managed by the app are not checked for updates.
    var emDS = this._updater._emDS;
    if (emDS.getItemProperty(aItem.id, "appManaged") == "true") {
      var status = Ci.nsIAddonUpdateCheckListener.STATUS_APP_MANAGED;
      this._updater.checkForDone(aItem, status);
      return;
    }

    // Items that have a pending install, uninstall, or upgrade are not checked
    // for updates.
    var opType = emDS.getItemProperty(aItem.id, "opType");
    if (opType) {
      var status = Ci.nsIAddonUpdateCheckListener.STATUS_PENDING_OP;
      this._updater.checkForDone(aItem, status);
      return;
    }

    var installLocation = InstallLocations.get(emDS.getInstallLocationKey(aItem.id));
    // Don't check items for updates that are managed independently
    if (installLocation && installLocation.itemIsManagedIndependently(aItem.id)) {
      var status = Ci.nsIAddonUpdateCheckListener.STATUS_NOT_MANAGED;
      this._updater.checkForDone(aItem, status);
      return;
    }

    // Don't check items for updates if the location can't be written to except
    // when performing a version only update.
    if ((aUpdateCheckType == Ci.nsIExtensionManager.UPDATE_CHECK_NEWVERSION ||
         aUpdateCheckType == Ci.nsIExtensionManager.UPDATE_NOTIFY_NEWVERSION) &&
        (!installLocation || !installLocation.canAccess)) {
      var status = Ci.nsIAddonUpdateCheckListener.STATUS_READ_ONLY;
      this._updater.checkForDone(aItem, status);
      return;
    }

    this._updateCheckType = aUpdateCheckType;
    this._item = aItem;

    // Look for a custom update URI: 1) supplied by a pref, 2) supplied by the
    // install manifest, 3) the default configuration
    try {
      var dsURI = gPref.getComplexValue(PREF_EM_ITEM_UPDATE_URL.replace(/%UUID%/, aItem.id),
                                        Ci.nsIPrefLocalizedString).data;
    }
    catch (e) { }
    if (!dsURI)
      dsURI = aItem.updateRDF;
    if (!dsURI)
      dsURI = gPref.getCharPref(PREF_UPDATE_DEFAULT_URL);

    dsURI = escapeAddonURI(aItem, this._updater._appVersion, dsURI, emDS);

    // Verify that the URI provided is valid
    try {
      var uri = newURI(dsURI);
    }
    catch (e) {
      LOG("RDFItemUpdater:checkForUpdates: There was an error loading the \r\n" +
          " update datasource for: " + dsURI + ", item = " + aItem.id + ", error: " + e);
      this._updater.checkForDone(aItem,
                                 Ci.nsIAddonUpdateCheckListener.STATUS_FAILURE);
      return;
    }

    LOG("RDFItemUpdater:checkForUpdates sending a request to server for: " +
        uri.spec + ", item = " + aItem.objectSource);

    var request = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"].
                  createInstance(Ci.nsIXMLHttpRequest);
    request.open("GET", uri.spec, true);
    request.channel.notificationCallbacks = new BadCertHandler();
    request.overrideMimeType("text/xml");
    request.channel.loadFlags |= Ci.nsIRequest.LOAD_BYPASS_CACHE;

    var self = this;
    request.onerror     = function(event) { self.onXMLError(event, aItem);    };
    request.onload      = function(event) { self.onXMLLoad(event, aItem);     };
    request.send(null);
  },

  onXMLLoad: function RDFItemUpdater_onXMLLoad(aEvent, aItem) {
    var request = aEvent.target;
    try {
      checkCert(request.channel);
    }
    catch (e) {
      // This may be overly restrictive in two cases: corporate installations
      // with a corporate update server using an in-house CA cert (installed
      // but not "built-in") and lone developers hosting their updates on a
      // site with a self-signed cert (permanently accepted, otherwise the
      // BadCertHandler would prevent getting this far). Update checks will
      // fail in both these scenarios.
      // How else can we protect the vast majority of updates served from AMO
      // from the spoofing attack described in bug 340198 while allowing those
      // other cases? A "hackme" pref? Domain-control certs are cheap, getting
      // one should not be a barrier in either case.
      LOG("RDFItemUpdater::onXMLLoad: " + e);
      this._updater.checkForDone(aItem,
                                 Ci.nsIAddonUpdateCheckListener.STATUS_FAILURE);
      return;
    }
    var responseXML = request.responseXML;

    // If the item does not have an update RDF and returns an error it is not
    // treated as a failure since all items without an updateURL are checked
    // for updates on AMO even if they are not hosted there.
    if (!responseXML || responseXML.documentElement.namespaceURI == XMLURI_PARSE_ERROR ||
        (request.status != 200 && request.status != 0)) {
      this._updater.checkForDone(aItem, (aItem.updateRDF ? Ci.nsIAddonUpdateCheckListener.STATUS_FAILURE :
                                                           Ci.nsIAddonUpdateCheckListener.STATUS_NONE));
      return;
    }

    var rdfParser = Cc["@mozilla.org/rdf/xml-parser;1"].
                    createInstance(Ci.nsIRDFXMLParser)
    var ds = Cc["@mozilla.org/rdf/datasource;1?name=in-memory-datasource"].
             createInstance(Ci.nsIRDFDataSource);
    rdfParser.parseString(ds, request.channel.URI, request.responseText);

    this.onDatasourceLoaded(ds, aItem);
  },

  onXMLError: function RDFItemUpdater_onXMLError(aEvent, aItem) {
    try {
      var request = aEvent.target;
      // the following may throw (e.g. a local file or timeout)
      var status = request.status;
    }
    catch (e) {
      request = aEvent.target.channel.QueryInterface(Ci.nsIRequest);
      status = request.status;
    }
    // this can fail when a network connection is not present.
    try {
      var statusText = request.statusText;
    }
    catch (e) {
      status = 0;
    }
    // When status is 0 we don't have a valid channel.
    if (status == 0)
      statusText = "nsIXMLHttpRequest channel unavailable";

    LOG("RDFItemUpdater:onError: There was an error loading the \r\n" +
        "the update datasource for item " + aItem.id + ", error: " + statusText);
    this._updater.checkForDone(aItem,
                               Ci.nsIAddonUpdateCheckListener.STATUS_FAILURE);
  },

  onDatasourceLoaded: function RDFItemUpdater_onDatasourceLoaded(aDatasource, aLocalItem) {
    /*
//@line 6658 "e:\builds\moz2_slave\mozilla-1.9.1-win32-xulrunner\build\toolkit\mozapps\extensions\src\nsExtensionManager.js.in"
    */
    if (!aDatasource.GetAllResources().hasMoreElements()) {
      LOG("RDFItemUpdater:onDatasourceLoaded: Datasource empty.\r\n" +
          "If you are an Extension developer and were expecting there to be\r\n" +
          "updates, this could mean any number of things, since the RDF system\r\n" +
          "doesn't give up much in the way of information when the load fails.\r\n" +
          "\r\nTry checking that: \r\n" +
          " 1. Your remote RDF file exists at the location.\r\n" +
          " 2. Your RDF file is valid XML (starts with <?xml version=\"1.0\"?>\r\n" +
          "    and loads in Firefox displaying pretty printed like other XML documents\r\n" +
          " 3. Your server is sending the data in the correct MIME\r\n" +
          "    type (text/xml)");
    }      

    // If we have an update key then the update manifest must be signed
    if (aLocalItem.updateKey) {
      var extensionRes = gRDF.GetResource(getItemPrefix(aLocalItem.type) + aLocalItem.id);
      LOG(extensionRes.Value);
      var signature = this._getPropertyFromResource(aDatasource, extensionRes, "signature", null);
      if (signature) {
        var serializer = new RDFSerializer();
        try {
          var updateString = serializer.serializeResource(aDatasource, extensionRes);
          var verifier = Cc["@mozilla.org/security/datasignatureverifier;1"].
                         getService(Ci.nsIDataSignatureVerifier);
          try {
            if (!verifier.verifyData(updateString, signature, aLocalItem.updateKey)) {
              LOG("RDFItemUpdater:onDatasourceLoaded: Update manifest for " +
                  aLocalItem.id + " failed signature check.");
              this._updater.checkForDone(aLocalItem, Ci.nsIAddonUpdateCheckListener.STATUS_FAILURE);
              return;
            }
          }
          catch (e) {
            LOG("RDFItemUpdater:onDatasourceLoaded: Failed to verify signature for " +
                aLocalItem.id + ". This indicates a malformed update key or signature.");
            this._updater.checkForDone(aLocalItem, Ci.nsIAddonUpdateCheckListener.STATUS_FAILURE);
            return;
          }
        }
        catch (e) {
          LOG("RDFItemUpdater:onDatasourceLoaded: Failed to generate signature " +
              "string for " + aLocalItem.id + ". Serializer threw " + e);
          this._updater.checkForDone(aLocalItem, Ci.nsIAddonUpdateCheckListener.STATUS_FAILURE);
          return;
        }
      }
      else {
        LOG("RDFItemUpdater:onDatasourceLoaded: Update manifest for " +
            aLocalItem.id + " did not contain a signature.");
        this._updater.checkForDone(aLocalItem, Ci.nsIAddonUpdateCheckListener.STATUS_FAILURE);
        return;
      }
    }
    /* If there is no updateKey either the update was over SSL, or it is an old
     * addon that we are allowing a grace update. */

    // Parse the response RDF
    var newerItem, sameItem;

    // Firefox 1.0PR+ update.rdf format
    if (this._updateCheckType == Ci.nsIExtensionManager.UPDATE_CHECK_NEWVERSION ||
        this._updateCheckType == Ci.nsIExtensionManager.UPDATE_NOTIFY_NEWVERSION) {
      // Look for newer versions of this item, we only do this in "normal"
      // mode... see comment by ExtensionItemUpdater_checkForUpdates
      // about how we do this in all cases but Install Phone Home - which
      // only needs to do a version check.
      newerItem = this._parseV20UpdateInfo(aDatasource, aLocalItem,
                                           this._updateCheckType);

      if (newerItem) {
        ++this._updater._updateCount;
        LOG("RDFItemUpdater:onDatasourceLoaded: Found a newer version of this item:\r\n" +
            newerItem.objectSource);
      }
    }

    // Now look for updated version compatibility metadata for the currently
    // installed version...
    sameItem = this._parseV20UpdateInfo(aDatasource, aLocalItem,
                                        Ci.nsIExtensionManager.UPDATE_CHECK_COMPATIBILITY);

    if (sameItem) {
      // Install-time updates are not written to the DS because there is no
      // entry yet, EM just uses the notifications to ascertain (by hand)
      // whether or not there is a remote maxVersion tweak that makes the
      // item being installed compatible.
      if (!this._updater._applyVersionUpdates(aLocalItem, sameItem))
        sameItem = null;
      else
        LOG("RDFItemUpdater:onDatasourceLoaded: Found info about the installed\r\n" +
            "version of this item: " + sameItem.objectSource);
    }
    var item = null, status = Ci.nsIAddonUpdateCheckListener.STATUS_NONE;
    if ((this._updateCheckType == Ci.nsIExtensionManager.UPDATE_CHECK_NEWVERSION ||
         this._updateCheckType == Ci.nsIExtensionManager.UPDATE_NOTIFY_NEWVERSION)
        && newerItem) {
      item = newerItem;
      status = Ci.nsIAddonUpdateCheckListener.STATUS_UPDATE;
    }
    else if (sameItem) {
      item = sameItem;
      status = Ci.nsIAddonUpdateCheckListener.STATUS_VERSIONINFO;
    }
    else {
      item = aLocalItem;
      status = Ci.nsIAddonUpdateCheckListener.STATUS_NO_UPDATE;
    }
    // Only one call of this._updater.checkForDone is needed for RDF
    // responses, since there is only one response per item.
    this._updater.checkForDone(item, status);
  },

  // Get a compulsory property from a resource. Reports an error if the
  // property was not present.
  _getPropertyFromResource: function RDFItemUpdater__getPropertyFromResource(aDataSource,
                                                                             aSourceResource,
                                                                             aProperty,
                                                                             aLocalItem) {
    var rv;
    try {
      var property = gRDF.GetResource(EM_NS(aProperty));
      rv = stringData(aDataSource.GetTarget(aSourceResource, property, true));
      if (rv === undefined)
        throw Cr.NS_ERROR_FAILURE;
    }
    catch (e) {
      // XXXben show console message "aProperty" not found on aSourceResource.
      return null;
    }
    return rv;
  },

  /**
   * Parses the Firefox 1.0RC1+ update manifest format looking for new versions
   * of updated compatibility information about the given add-on.
   * @param   aDataSource
   *          The update manifest's datasource
   * @param   aLocalItem
   *          The nsIUpdateItem representing the add-on being checked for updates.
   * @param   aUpdateCheckType
   *          The type of update check being performed. See the constants in
   *          nsIExtensionManager
   * @returns An nsIUpdateItem holding the update's information if a valid
   *          update is found or null if not.
   */
  _parseV20UpdateInfo: function RDFItemUpdater__parseV20UpdateInfo(aDataSource,
                                                                   aLocalItem,
                                                                   aUpdateCheckType) {
    var extensionRes  = gRDF.GetResource(getItemPrefix(aLocalItem.type) + aLocalItem.id);

    var updatesArc = gRDF.GetResource(EM_NS("updates"));
    var updates = aDataSource.GetTarget(extensionRes, updatesArc, true);

    try {
      updates = updates.QueryInterface(Ci.nsIRDFResource);
    }
    catch (e) {
      LOG("RDFItemUpdater:_parseV20UpdateInfo: No updates were found for:\r\n" +
          aLocalItem.id + "\r\n" +
          "If you are an Extension developer and were expecting there to be\r\n" +
          "updates, this could mean any number of things, since the RDF system\r\n" +
          "doesn't give up much in the way of information when the load fails.\r\n" +
          "\r\nTry checking that: \r\n" +
          " 1. Your RDF File is correct - e.g. check that there is a top level\r\n" +
          "    RDF Resource with a URI urn:mozilla:extension:{GUID}, and that\r\n" +
          "    the <em:updates> listed all have matching GUIDs.");
      return null;
    }

    // Track the newest update found
    var updatedItem = null;

    var cu = Cc["@mozilla.org/rdf/container-utils;1"].
             getService(Ci.nsIRDFContainerUtils);
    if (cu.IsContainer(aDataSource, updates)) {
      var ctr = getContainer(aDataSource, updates);

      var versions = ctr.GetElements();
      while (versions.hasMoreElements()) {
        // There are two different methodologies for collecting version
        // information depending on whether or not we've been invoked in
        // "version updates only" mode or "version+newest" mode.
        var version = versions.getNext().QueryInterface(Ci.nsIRDFResource);
        var foundItem = this._parseV20Update(aDataSource, version, aLocalItem,
                                             updatedItem ? updatedItem.version : aLocalItem.version,
                                             aUpdateCheckType);
        if (foundItem) {
          // When not checking for new versions we can bail out on the first
          // result.
          if (aUpdateCheckType)
            return foundItem;
          updatedItem = foundItem;
        }
      }
    }
    return updatedItem;
  },

  /**
   * Parses a single version's update entry looking for the best matching
   * targetApplication entry.
   * @param   aDataSource
   *          The update manifest's datasource
   * @param   aUpdateResource
   *          The nsIRDFResource of the update entry.
   * @param   aLocalItem
   *          The nsIUpdateItem representing the add-on being checked for updates.
   * @param   aNewestVersionFound
   *          When checking for new versions holds the newest version of this
   *          add-on that we know about. Otherwise holds the current version.
   * @param   aUpdateCheckType
   *          The type of update check being performed. See the constants in
   *          nsIExtensionManager
   * @returns An nsIUpdateItem holding the update's information if a valid
   *          update is found or null if not.
   */
  _parseV20Update: function RDFItemUpdater__parseV20Update(aDataSource,
                                                           aUpdateResource,
                                                           aLocalItem,
                                                           aNewestVersionFound,
                                                           aUpdateCheckType) {
    var version = this._getPropertyFromResource(aDataSource, aUpdateResource,
                                                "version", aLocalItem);
    /* If we are looking for new versions then test whether this discovered
     * version is greater than any previously found update. Otherwise check
     * if this update is for the same version as we have installed. */
    var result = gVersionChecker.compare(version, aNewestVersionFound);
    if ((aUpdateCheckType == Ci.nsIExtensionManager.UPDATE_CHECK_NEWVERSION ||
         aUpdateCheckType == Ci.nsIExtensionManager.UPDATE_NOTIFY_NEWVERSION) ? result <= 0 : result != 0)
      return null;

    var taArc = gRDF.GetResource(EM_NS("targetApplication"));
    var targetApps = aDataSource.GetTargets(aUpdateResource, taArc, true);
    
    // Track the best update we have found so far
    var newestUpdateItem = null;
    while (targetApps.hasMoreElements()) {
      var targetApp = targetApps.getNext().QueryInterface(Ci.nsIRDFResource);
      var appID = this._getPropertyFromResource(aDataSource, targetApp, "id", aLocalItem);
      if (appID != gApp.ID && appID != TOOLKIT_ID)
        continue;

      var updateLink = this._getPropertyFromResource(aDataSource, targetApp, "updateLink", aLocalItem);
      var updateHash = this._getPropertyFromResource(aDataSource, targetApp, "updateHash", aLocalItem);
      if (aUpdateCheckType == Ci.nsIExtensionManager.UPDATE_CHECK_NEWVERSION ||
          aUpdateCheckType == Ci.nsIExtensionManager.UPDATE_NOTIFY_NEWVERSION) {
        // New version information is useless without a link to get it from
        if (!updateLink)
          continue;

        /* If the update link is non-ssl and we do not have a hash or the hash
         * is of an insecure nature then we must ignore this update. Bypass
         * this if not checking update security. Currently we only consider
         * the sha hashing algorithms as secure. */
        if (gCheckUpdateSecurity && updateLink.substring(0, 6) != "https:" && 
            (!updateHash || updateHash.substring(0, 3) != "sha")) {
          LOG("RDFItemUpdater:_parseV20Update: Update for " + aLocalItem.id +
              " at " + updateLink + " ignored because it is insecure. updateLink " +
              " must be a https url or an updateHash must be specified.");
          continue;
        }
      }

      var updatedItem = makeItem(aLocalItem.id,
                                 version,
                                 aLocalItem.installLocationKey,
                                 this._getPropertyFromResource(aDataSource, targetApp, "minVersion", aLocalItem),
                                 this._getPropertyFromResource(aDataSource, targetApp, "maxVersion", aLocalItem),
                                 aLocalItem.name,
                                 updateLink,
                                 updateHash,
                                 "", /* Icon URL */
                                 "", /* RDF Update URL */
                                 "", /* Update Key */
                                 aLocalItem.type,
                                 appID);

      if (this._updater._isValidUpdate(aLocalItem, updatedItem, aUpdateCheckType)) {
        if (aUpdateCheckType == Ci.nsIExtensionManager.UPDATE_CHECK_NEWVERSION) {
          var infourl = this._getPropertyFromResource(aDataSource, targetApp,
                                                      "updateInfoURL");
          if (infourl)
            infourl = EM_L(infourl);
          this._updater._emDS.setItemProperty(aLocalItem.id,
                                              EM_R("availableUpdateInfo"),
                                              infourl);
        }
        if (appID == gApp.ID) {
          // App takes precedence over toolkit.  If we found the app, bail out.
          return updatedItem;
        }
        newestUpdateItem = updatedItem;
      }
    }
    return newestUpdateItem;
  }
};

/**
 * A serialisation method for RDF data that produces an identical string
 * provided that the RDF assertions match.
 * The serialisation is not complete, only assertions stemming from a given
 * resource are included, multiple references to the same resource are not
 * permitted, and the RDF prolog and epilog are not included.
 * RDF Blob and Date literals are not supported.
 */
function RDFSerializer()
{
  this.cUtils = Cc["@mozilla.org/rdf/container-utils;1"].
                getService(Ci.nsIRDFContainerUtils);
  this.resources = [];
}

RDFSerializer.prototype = {
  INDENT: "  ",      // The indent used for pretty-printing
  resources: null,   // Array of the resources that have been found
  
  /**
   * Escapes characters from a string that should not appear in XML.
   * @param string     The string to be escaped
   * @returns a string with all characters invalid in XML character data
   *          converted to entity references.
   */
  escapeEntities: function RDFSerializer_escapeEntities(string)
  {
    string = string.replace(/&/g, "&amp;");
    string = string.replace(/</g, "&lt;");
    string = string.replace(/>/g, "&gt;");
    string = string.replace(/"/g, "&quot;");
    return string;
  },
  
  /**
   * Serializes all the elements of an RDF container.
   * @param ds         The datasource holding the data
   * @param container  The RDF container to output the child elements of
   * @param indent     The current level of indent for pretty-printing
   * @returns a string containing the serialized elements.
   */
  serializeContainerItems: function RDFSerializer_serializeContainerItems(ds, container, indent)
  {
    var result = "";
    var items = container.GetElements();
    while (items.hasMoreElements()) {
      var item = items.getNext().QueryInterface(Ci.nsIRDFResource);
      result += indent + "<RDF:li>\n"
      result += this.serializeResource(ds, item, indent + this.INDENT);
      result += indent + "</RDF:li>\n"
    }
    return result;
  },
  
  /**
   * Serializes all em:* (see EM_NS) properties of an RDF resource except for
   * the em:signature property. As this serialization is to be compared against
   * the manifest signature it cannot contain the em:signature property itself.
   * @param ds         The datasource holding the data
   * @param resource   The RDF resource to output the properties of
   * @param indent     The current level of indent for pretty-printing
   * @returns a string containing the serialized properties.
   */
  serializeResourceProperties: function RDFSerializer_serializeResourceProperties(ds, resource, indent)
  {
    var result = "";
    var items = [];
    var arcs = ds.ArcLabelsOut(resource);
    while (arcs.hasMoreElements()) {
      var arc = arcs.getNext().QueryInterface(Ci.nsIRDFResource);
      if (arc.ValueUTF8.substring(0, PREFIX_NS_EM.length) != PREFIX_NS_EM)
        continue;
      var prop = arc.ValueUTF8.substring(PREFIX_NS_EM.length);
      if (prop == "signature")
        continue;
  
      var targets = ds.GetTargets(resource, arc, true);
      while (targets.hasMoreElements()) {
        var target = targets.getNext();
        if (target instanceof Ci.nsIRDFResource) {
          var item = indent + "<em:" + prop + ">\n";
          item += this.serializeResource(ds, target, indent + this.INDENT);
          item += indent + "</em:" + prop + ">\n";
          items.push(item);
        }
        else if (target instanceof Ci.nsIRDFLiteral) {
          items.push(indent + "<em:" + prop + ">" + this.escapeEntities(target.Value) + "</em:" + prop + ">\n");
        }
        else if (target instanceof Ci.nsIRDFInt) {
          items.push(indent + "<em:" + prop + " NC:parseType=\"Integer\">" + target.Value + "</em:" + prop + ">\n");
        }
        else {
          throw new Error("Cannot serialize unknown literal type");
        }
      }
    }
    items.sort();
    result += items.join("");
    return result;
  },
  
  /**
   * Recursively serializes an RDF resource and all resources it links to.
   * This will only output EM_NS properties and will ignore any em:signature
   * property.
   * @param ds         The datasource holding the data
   * @param resource   The RDF resource to serialize
   * @param indent     The current level of indent for pretty-printing.
   *                   Leave undefined for no indent
   * @returns a string containing the serialized resource.
   * @throws if the RDF data contains multiple references to the same resource.
   */
  serializeResource: function RDFSerializer_serializeResource(ds, resource, indent)
  {
    if (this.resources.indexOf(resource) != -1 ) {
      // We cannot output multiple references to the same resource.
      throw new Error("Cannot serialize multiple references to "+resource.Value);
    }
    if (indent === undefined)
      indent = "";
    
    this.resources.push(resource);
    var container = null;
    var type = "Description";
    if (this.cUtils.IsSeq(ds, resource)) {
      type = "Seq";
      container = this.cUtils.MakeSeq(ds, resource);
    }
    else if (this.cUtils.IsAlt(ds, resource)) {
      type = "Alt";
      container = this.cUtils.MakeAlt(ds, resource);
    }
    else if (this.cUtils.IsBag(ds, resource)) {
      type = "Bag";
      container = this.cUtils.MakeBag(ds, resource);
    }
  
    var result = indent + "<RDF:" + type;
    if (!gRDF.IsAnonymousResource(resource))
      result += " about=\"" + this.escapeEntities(resource.ValueUTF8) + "\"";
    result += ">\n";
  
    if (container)
      result += this.serializeContainerItems(ds, container, indent + this.INDENT);
      
    result += this.serializeResourceProperties(ds, resource, indent + this.INDENT);
  
    result += indent + "</RDF:" + type + ">\n";
    return result;
  }
}

/**
 * A Datasource that holds Extensions.
 * - Implements nsIRDFDataSource to drive UI
 * - Uses a RDF/XML datasource for storage (this is undesirable)
 *
 * @constructor
 */
function ExtensionsDataSource(em) {
  this._em = em;

  this._itemRoot = gRDF.GetResource(RDFURI_ITEM_ROOT);
  this._defaultTheme = gRDF.GetResource(RDFURI_DEFAULT_THEME);
}
ExtensionsDataSource.prototype = {
  _inner    : null,
  _em       : null,
  _itemRoot     : null,
  _defaultTheme : null,

  /**
   * Called during application shutdown to clear any references held.
   * The ExtensionsDataSource is unusable after calling this.
   */
  shutdown: function EMDS_shutdown() {
    this._inner = null;
    this._em = null;
    this._itemRoot = null;
    this._defaultTheme = null;
  },

  /**
   * Determines if an item's dependencies are satisfied. An item's dependencies
   * are satisifed when all items specified in the item's em:requires arc are
   * installed, enabled, and the version is compatible based on the em:requires
   * minVersion and maxVersion.
   * @param   id
   *          The ID of the item
   * @returns true if the item's dependencies are satisfied.
   *          false if the item's dependencies are not satisfied.
   */
  satisfiesDependencies: function EMDS_satisfiesDependencies(id) {
    var ds = this._inner;
    var itemResource = getResourceForID(id);
    var targets = ds.GetTargets(itemResource, EM_R("requires"), true);
    if (!targets.hasMoreElements())
      return true;

    getVersionChecker();
    var idRes = EM_R("id");
    var minVersionRes = EM_R("minVersion");
    var maxVersionRes = EM_R("maxVersion");
    while (targets.hasMoreElements()) {
      var target = targets.getNext().QueryInterface(Ci.nsIRDFResource);
      var dependencyID = stringData(ds.GetTarget(target, idRes, true));
      var version = null;
      version = this.getItemProperty(dependencyID, "version");
      if (version) {
        var opType = this.getItemProperty(dependencyID, "opType");
        if (opType ==  OP_NEEDS_DISABLE || opType == OP_NEEDS_UNINSTALL)
          return false;

        if (this.getItemProperty(dependencyID, "userDisabled") == "true" ||
            this.getItemProperty(dependencyID, "appDisabled") == "true" ||
            this.getItemProperty(dependencyID, "userDisabled") == OP_NEEDS_DISABLE ||
            this.getItemProperty(dependencyID, "appDisabled") == OP_NEEDS_DISABLE)
          return false;

        var minVersion = stringData(ds.GetTarget(target, minVersionRes, true));
        var maxVersion = stringData(ds.GetTarget(target, maxVersionRes, true));
        var compatible = (gVersionChecker.compare(version, minVersion) >= 0 &&
                          gVersionChecker.compare(version, maxVersion) <= 0);
        if (!compatible)
          return false;
      }
      else {
        return false;
      }
    }

    return true;
  },

  /**
   * Determine if an item is compatible
   * @param   datasource
   *          The datasource to inspect for compatibility - can be the main
   *          datasource or an Install Manifest.
   * @param   source
   *          The RDF Resource of the item to inspect for compatibility.
   * @param   appVersion
   *          The version of the application we are checking for compatibility
   *          against. If this parameter is undefined, the version of the running
   *          application is used.
   * @param   platformVersion
   *          The version of the toolkit to check compatibility against
   * @returns true if the item is compatible with this version of the
   *          application, false, otherwise.
   */
  isCompatible: function EMDS_isCompatible(datasource, source, appVersion, platformVersion) {
    // The Default Theme is always compatible.
    if (source.EqualsNode(this._defaultTheme))
      return true;

    var appID = gApp.ID;
    if (appVersion === undefined)
      appVersion = gApp.version;
    if (platformVersion === undefined)
      var platformVersion = gApp.platformVersion;

    var targets = datasource.GetTargets(source, EM_R("targetApplication"), true);
    var idRes = EM_R("id");
    var minVersionRes = EM_R("minVersion");
    var maxVersionRes = EM_R("maxVersion");
    var versionChecker = getVersionChecker();
    var rv = false;
    while (targets.hasMoreElements()) {
      var targetApp = targets.getNext().QueryInterface(Ci.nsIRDFResource);
      var id          = stringData(datasource.GetTarget(targetApp, idRes, true));
      var minVersion  = stringData(datasource.GetTarget(targetApp, minVersionRes, true));
      var maxVersion  = stringData(datasource.GetTarget(targetApp, maxVersionRes, true));
      if (id == appID) {
        rv = (versionChecker.compare(appVersion, minVersion) >= 0) &&
             (versionChecker.compare(appVersion, maxVersion) <= 0);
        return rv; // App takes precedence over toolkit.
      }

      if (id == TOOLKIT_ID) {
        rv =  (versionChecker.compare(platformVersion, minVersion) >= 0) &&
              (versionChecker.compare(platformVersion, maxVersion) <= 0);
        // Keep looping, in case the app id is later.
      }
    }
    return rv;
  },

  /**
   * Gets a list of items that are incompatible with a specific application version.
   * @param   appID
   *          The ID of the application - XXXben unused?
   * @param   appVersion
   *          The Version of the application to check for incompatibility against.
   * @param   platformVersion
   *          The version of the toolkit to check compatibility against
   * @param   desiredType
   *          The nsIUpdateItem type of items to look for
   * @param   includeDisabled
   *          Whether or not disabled items should be included in the set returned
   * @returns An array of nsIUpdateItems that are incompatible with the application
   *          ID/Version supplied.
   */
  getIncompatibleItemList: function EMDS_getIncompatibleItemList(appID,
                                                                 appVersion,
                                                                 platformVersion,
                                                                 desiredType,
                                                                 includeDisabled) {
    var items = [];
    var ctr = getContainer(this._inner, this._itemRoot);
    var elements = ctr.GetElements();
    while (elements.hasMoreElements()) {
      var item = elements.getNext().QueryInterface(Ci.nsIRDFResource);
      var id = stripPrefix(item.Value, PREFIX_ITEM_URI);
      var type = this.getItemProperty(id, "type");
      // Skip this item if we're not seeking disabled items
      if (!includeDisabled && this.getItemProperty(id, "isDisabled") == "true")
        continue;

      // If the id of this item matches one of the items potentially installed
      // with and maintained by this application AND it is installed in the
      // global install location (i.e. the place installed by the app installer)
      // it is and can be managed by the update file - it's not an item that has
      // been manually installed by the user into their profile dir, and as such
      // it is always compatible with the next release of the application since
      // we will continue to support it.
      var locationKey = this.getItemProperty(id, "installLocation");
      var appManaged = this.getItemProperty(id, "appManaged") == "true";
      if (appManaged && locationKey == KEY_APP_GLOBAL)
        continue;

      if (type != -1 && (type & desiredType) &&
          !this.isCompatible(this, item, appVersion, platformVersion))
        items.push(this.getItemForID(id));
    }
    return items;
  },

  /**
   * Gets a list of items of a specific type
   * @param   desiredType
   *          The nsIUpdateItem type of items to return
   * @param   countRef
   *          The XPCJS reference to the size of the returned array
   * @returns An array of nsIUpdateItems, populated only with an item for |id|
   *          if |id| is non-null, otherwise all items matching the specified
   *          type.
   */
  getItemList: function EMDS_getItemList(desiredType, countRef) {
    var items = [];
    var ctr = getContainer(this, this._itemRoot);
    var elements = ctr.GetElements();
    while (elements.hasMoreElements()) {
      var e = elements.getNext().QueryInterface(Ci.nsIRDFResource);
      var eID = stripPrefix(e.Value, PREFIX_ITEM_URI);
      var type = this.getItemProperty(eID, "type");
      if (type != -1 && type & desiredType)
        items.push(this.getItemForID(eID));
    }
    countRef.value = items.length;
    return items;
  },

  /**
   * Retrieves a list of installed nsIUpdateItems of items that are dependent
   * on another item.
   * @param   id
   *          The ID of the item that other items depend on.
   * @param   includeDisabled
   *          Whether to include disabled items in the set returned.
   * @param   countRef
   *          The XPCJS reference to the number of items returned.
   * @returns An array of installed nsIUpdateItems that depend on the item
   *          specified by the id parameter.
   */
  getDependentItemListForID: function EMDS_getDependentItemListForID(id,
                                                                     includeDisabled,
                                                                     countRef) {
    var items = [];
    var ds = this._inner;
    var ctr = getContainer(this, this._itemRoot);
    var elements = ctr.GetElements();
    while (elements.hasMoreElements()) {
      var e = elements.getNext().QueryInterface(Ci.nsIRDFResource);
      var dependentID = stripPrefix(e.Value, PREFIX_ITEM_URI);
      var targets = ds.GetTargets(e, EM_R("requires"), true);
      var idRes = EM_R("id");
      while (targets.hasMoreElements()) {
        var target = targets.getNext().QueryInterface(Ci.nsIRDFResource);
        var dependencyID = stringData(ds.GetTarget(target, idRes, true));
        if (dependencyID == id) {
          if (!includeDisabled && this.getItemProperty(dependentID, "isDisabled") == "true")
            continue;
          items.push(this.getItemForID(dependentID));
          break;
        }
      }
    }
    countRef.value = items.length;
    return items;
  },

  /**
   * Constructs an nsIUpdateItem for the given item ID
   * @param   id
   *          The GUID of the item to construct a nsIUpdateItem for
   * @returns The nsIUpdateItem for the id.
   */
  getItemForID: function EMDS_getItemForID(id) {
    if (!this.visibleItems[id])
      return null;

    var r = getResourceForID(id);
    if (!r)
      return null;

    var targetAppInfo = this.getTargetApplicationInfo(id, this);
    var updateHash = this.getItemProperty(id, "availableUpdateHash");
    return makeItem(id,
                    this.getItemProperty(id, "version"),
                    this.getItemProperty(id, "installLocation"),
                    targetAppInfo ? targetAppInfo.minVersion : "",
                    targetAppInfo ? targetAppInfo.maxVersion : "",
                    this.getItemProperty(id, "name"),
                    this.getItemProperty(id, "availableUpdateURL"),
                    updateHash ? updateHash : "",
                    this.getItemProperty(id, "iconURL"),
                    this.getItemProperty(id, "updateURL"),
                    this.getItemProperty(id, "updateKey"),
                    this.getItemProperty(id, "type"),
                    targetAppInfo ? targetAppInfo.appID : gApp.ID);
  },

  /**
   * Gets the name of the Install Location where an item is installed.
   * @param   id
   *          The GUID of the item to locate an Install Location for
   * @returns The string name of the Install Location where the item is
   *          installed.
   */
  getInstallLocationKey: function EMDS_getInstallLocationKey(id) {
    return this.getItemProperty(id, "installLocation");
  },

  /**
   * Sets an RDF property on an item in a datasource. Does not create
   * multiple assertions
   * @param   datasource
   *          The target datasource where the property should be set
   * @param   source
   *          The RDF Resource to set the property on
   * @param   property
   *          The RDF Resource of the property to set
   * @param   newValue
   *          The RDF Node containing the new property value
   */
  _setProperty: function EMDS__setProperty(datasource, source, property, newValue) {
    var oldValue = datasource.GetTarget(source, property, true);
    if (oldValue) {
      if (newValue)
        datasource.Change(source, property, oldValue, newValue);
      else
        datasource.Unassert(source, property, oldValue);
    }
    else if (newValue)
      datasource.Assert(source, property, newValue, true);
  },

  /**
   * Gets the updated target application info if it exists for an item from
   * the Extensions datasource during an installation or upgrade.
   * @param   id
   *          The ID of the item to discover updated target application info for
   * @returns A JS Object with the following properties:
   *          "id"            The id of the item
   *          "minVersion"    The updated minimum version of the target
   *                          application that this item can run in
   *          "maxVersion"    The updated maximum version of the target
   *                          application that this item can run in
   */
  getUpdatedTargetAppInfo: function EMDS_getUpdatedTargetAppInfo(id) {
    // The default theme is always compatible so there is never update info.
    if (getResourceForID(id).EqualsNode(this._defaultTheme))
      return null;

    var appID = gApp.ID;
    var r = getResourceForID(id);
    var targetApps = this._inner.GetTargets(r, EM_R("targetApplication"), true);
    if (!targetApps.hasMoreElements())
      targetApps = this._inner.GetTargets(gInstallManifestRoot, EM_R("targetApplication"), true);
    var outData = null;
    while (targetApps.hasMoreElements()) {
      var targetApp = targetApps.getNext();
      if (targetApp instanceof Ci.nsIRDFResource) {
        try {
          var foundAppID = stringData(this._inner.GetTarget(targetApp, EM_R("id"), true));
          // Different target application?
          if (foundAppID != appID && foundAppID != TOOLKIT_ID)
            continue;
          var updatedMinVersion = this._inner.GetTarget(targetApp, EM_R("updatedMinVersion"), true);
          var updatedMaxVersion = this._inner.GetTarget(targetApp, EM_R("updatedMaxVersion"), true);
          if (updatedMinVersion && updatedMaxVersion)
            outData = { id          : id,
                        targetAppID : foundAppID,
                        minVersion  : stringData(updatedMinVersion),
                        maxVersion  : stringData(updatedMaxVersion) };
          if (foundAppID == appID)
            return outData;
        }
        catch (e) {
          continue;
        }
      }
    }
    return outData;
  },

  /**
   * Sets the updated target application info for an item in the Extensions
   * datasource during an installation or upgrade.
   * @param   id
   *          The ID of the item to set updated target application info for
   * @param   targetAppID
   *          The target application ID used for checking compatibility for this item.
   * @param   updatedMinVersion
   *          The updated minimum version of the target application that this
   *          item can run in
   * @param   updatedMaxVersion
   *          The updated maximum version of the target application that this
   *          item can run in
   *
   * @note Add-ons can specify a targetApplication id of toolkit@mozilla.org in
   *       their install manifest for compatibility with all apps using a
   *       specific release of the toolkit.
   */
  setUpdatedTargetAppInfo: function EMDS_setUpdatedTargetAppInfo(id, targetAppID,
                                                                 updatedMinVersion,
                                                                 updatedMaxVersion) {
    // The default theme is always compatible so it is never updated.
    if (getResourceForID(id).EqualsNode(this._defaultTheme))
      return;

    // Version/Dependency Info
    var updatedMinVersionRes = EM_R("updatedMinVersion");
    var updatedMaxVersionRes = EM_R("updatedMaxVersion");

    var appID = gApp.ID;
    var r = getResourceForID(id);
    var targetApps = this._inner.GetTargets(r, EM_R("targetApplication"), true);
    // add updatedMinVersion and updatedMaxVersion for an install else an upgrade
    if (!targetApps.hasMoreElements()) {
      var idRes = EM_R("id");
      var targetRes = getResourceForID(id);
      var property = EM_R("targetApplication");
      var anon = gRDF.GetAnonymousResource();
      this._inner.Assert(anon, idRes, EM_L(appID), true);
      this._inner.Assert(anon, updatedMinVersionRes, EM_L(updatedMinVersion), true);
      this._inner.Assert(anon, updatedMaxVersionRes, EM_L(updatedMaxVersion), true);
      this._inner.Assert(targetRes, property, anon, true);
    }
    else {
      while (targetApps.hasMoreElements()) {
        var targetApp = targetApps.getNext();
        if (targetApp instanceof Ci.nsIRDFResource) {
          var foundAppID = stringData(this._inner.GetTarget(targetApp, EM_R("id"), true));
          // Different target application?
          if (foundAppID != targetAppID)
            continue;
          this._inner.Assert(targetApp, updatedMinVersionRes, EM_L(updatedMinVersion), true);
          this._inner.Assert(targetApp, updatedMaxVersionRes, EM_L(updatedMaxVersion), true);
          break;
        }
      }
    }
    this.Flush();
  },

  /**
   * Gets the target application info for an item from a datasource.
   * @param   id
   *          The GUID of the item to discover target application info for
   * @param   datasource
   *          The datasource to look up target application info in
   * @returns A JS Object with the following properties:
   *          "appID"         The target application ID used for checking
   *                          compatibility for this item.
   *          "minVersion"    The minimum version of the target application
   *                          that this item can run in
   *          "maxVersion"    The maximum version of the target application
   *                          that this item can run in
   *          or null, if no target application data exists for the specified
   *          id in the supplied datasource.
   */
  getTargetApplicationInfo: function EMDS_getTargetApplicationInfo(id, datasource) {
    var appID = gApp.ID;
    // The default theme is always compatible.
    if (getResourceForID(id).EqualsNode(this._defaultTheme)) {
      var ver = gApp.version;
      return { appID: appID, minVersion: ver, maxVersion: ver };
    }

    var r = getResourceForID(id);
    var targetApps = datasource.GetTargets(r, EM_R("targetApplication"), true);
    if (!targetApps)
      return null;

    if (!targetApps.hasMoreElements())
      targetApps = datasource.GetTargets(gInstallManifestRoot, EM_R("targetApplication"), true);
    var outData = null;
    while (targetApps.hasMoreElements()) {
      var targetApp = targetApps.getNext();
      if (targetApp instanceof Ci.nsIRDFResource) {
        try {
          var foundAppID = stringData(datasource.GetTarget(targetApp, EM_R("id"), true));
          // Different target application?
          if (foundAppID != appID && foundAppID != TOOLKIT_ID)
            continue;

          outData = { appID: foundAppID,
                      minVersion: stringData(datasource.GetTarget(targetApp, EM_R("minVersion"), true)),
                      maxVersion: stringData(datasource.GetTarget(targetApp, EM_R("maxVersion"), true)) };
          if (foundAppID == appID)
            return outData;
        }
        catch (e) {
          continue;
        }
      }
    }
    return outData;
  },

  /**
   * Sets the target application info for an item in a datasource.
   * @param   id
   *          The GUID of the item to discover target application info for
   * @param   targetAppID
   *          The target application ID used for checking compatibility for this
   *          item.
   * @param   minVersion
   *          The minimum version of the target application that this item can
   *          run in
   * @param   maxVersion
   *          The maximum version of the target application that this item can
   *          run in
   * @param   datasource
   *          The datasource to look up target application info in
   *
   * @note Add-ons can specify a targetApplication id of toolkit@mozilla.org in
   *       their install manifest for compatibility with all apps using a
   *       specific release of the toolkit.
   */
  setTargetApplicationInfo: function EMDS_setTargetApplicationInfo(id, targetAppID,
                                                                   minVersion,
                                                                   maxVersion,
                                                                   datasource) {
    var targetDataSource = datasource;
    if (!targetDataSource)
      targetDataSource = this._inner;

    var appID = gApp.ID;
    var r = getResourceForID(id);
    var targetApps = targetDataSource.GetTargets(r, EM_R("targetApplication"), true);
    if (!targetApps.hasMoreElements())
      targetApps = datasource.GetTargets(gInstallManifestRoot, EM_R("targetApplication"), true);
    while (targetApps.hasMoreElements()) {
      var targetApp = targetApps.getNext();
      if (targetApp instanceof Ci.nsIRDFResource) {
        var foundAppID = stringData(targetDataSource.GetTarget(targetApp, EM_R("id"), true));
        // Different target application?
        if (foundAppID != targetAppID)
          continue;

        this._setProperty(targetDataSource, targetApp, EM_R("minVersion"), EM_L(minVersion));
        this._setProperty(targetDataSource, targetApp, EM_R("maxVersion"), EM_L(maxVersion));

        // If we were setting these properties on the main datasource, flush
        // it now. (Don't flush changes set on Install Manifests - they are
        // fleeting).
        if (!datasource)
          this.Flush();

        break;
      }
    }
  },

  /**
   * Gets a property of an item
   * @param   id
   *          The GUID of the item
   * @param   property
   *          The name of the property (excluding EM_NS)
   * @returns The literal value of the property, or undefined if there is no
   *          value.
   */
  getItemProperty: function EMDS_getItemProperty(id, property) {
    var item = getResourceForID(id);
    if (!item) {
      LOG("getItemProperty failing for lack of an item. This means getResourceForItem \
           failed to locate a resource for aItemID (item ID = " + id + ", property = " + property + ")");
    }
    else
      return this._getItemProperty(item, property);
    return undefined;
  },

  /**
   * Gets a property of an item resource
   * @param   itemResource
   *          The RDF Resource of the item
   * @param   property
   *          The name of the property (excluding EM_NS)
   * @returns The literal value of the property, or undefined if there is no
   *          value.
   */
  _getItemProperty: function EMDS__getItemProperty(itemResource, property) {
    var target = this.GetTarget(itemResource, EM_R(property), true);
    var value = stringData(target);
    if (value === undefined)
      value = intData(target);
    return value === undefined ? "" : value;
  },

  /**
   * Sets a property on an item.
   * @param   id
   *          The GUID of the item
   * @param   propertyArc
   *          The RDF Resource of the property arc
   * @param   propertyValue
   *          A nsIRDFLiteral value of the property to be set
   */
  setItemProperty: function EMDS_setItemProperty(id, propertyArc, propertyValue) {
    var item = getResourceForID(id);
    this._setProperty(this._inner, item, propertyArc, propertyValue);
    this.Flush();
  },

  /**
   * Sets one or more properties for an item.
   * @param   id
   *          The ID of the item
   * @param   properties
   *          A JS object which maps properties to values.
   */
  setItemProperties: function EMDS_setItemProperties(id, properties) {
    var item = getResourceForID(id);
    for (var key in properties)
      this._setProperty(this._inner, item, EM_R(key), properties[key]);
    this.Flush();
  },

  /**
   * Inserts the RDF resource for an item into a container.
   * @param   id
   *          The GUID of the item
   */
  insertItemIntoContainer: function EMDS_insertItemIntoContainer(id) {
    // Get the target container and resource
    var ctr = getContainer(this._inner, this._itemRoot);
    var itemResource = getResourceForID(id);
    // Don't bother adding the extension to the list if it's already there.
    // (i.e. we're upgrading)
    var oldIndex = ctr.IndexOf(itemResource);
    if (oldIndex == -1)
      ctr.AppendElement(itemResource);
    this.Flush();
  },

  /**
   * Removes the RDF resource for an item from its container.
   * @param   id
   *          The GUID of the item
   */
  removeItemFromContainer: function EMDS_removeItemFromContainer(id) {
    var ctr = getContainer(this._inner, this._itemRoot);
    var itemResource = getResourceForID(id);
    ctr.RemoveElement(itemResource, true);
    this.Flush();
  },

  /**
   * Removes a corrupt item entry from the extension list added due to buggy
   * code in previous EM versions!
   * @param   id
   *          The GUID of the item
   */
  removeCorruptItem: function EMDS_removeCorruptItem(id) {
    this.removeItemMetadata(id);
    this.removeItemFromContainer(id);
    this.visibleItems[id] = null;
  },

  /**
   * Removes a corrupt download entry from the list
   * @param   uri
   *          The RDF URI of the item.
   * @returns The RDF Resource of the removed entry
   */
  removeCorruptDLItem: function EMDS_removeCorruptDLItem(uri) {
    var itemResource = gRDF.GetResource(uri);
    var ctr = getContainer(this._inner, this._itemRoot);
    if (ctr.IndexOf(itemResource) != -1) {
      ctr.RemoveElement(itemResource, true);
      this._cleanResource(itemResource);
      this.Flush();
    }
    return itemResource;
  },

  /**
   * Copies localized properties from an install manifest to the datasource
   *
   * @param   installManifest
   *          The Install Manifest datasource we are copying from
   * @param   source
   *          The source resource of the localized properties
   * @param   target
   *          The target resource to store the localized properties
   */
  _addLocalizedMetadata: function EMDS__addLocalizedMetadata(installManifest,
                                                             sourceRes, targetRes)
  {
    var singleProps = ["name", "description", "creator", "homepageURL"];

    for (var i = 0; i < singleProps.length; ++i) {
      var property = EM_R(singleProps[i]);
      var literal = installManifest.GetTarget(sourceRes, property, true);
      // If literal is null, _setProperty will remove any existing.
      this._setProperty(this._inner, targetRes, property, literal);
    }

    // Assert properties with multiple values
    var manyProps = ["developer", "translator", "contributor"];
    for (var i = 0; i < manyProps.length; ++i) {
      var property = EM_R(manyProps[i]);
      var literals = installManifest.GetTargets(sourceRes, property, true);

      var oldValues = this._inner.GetTargets(targetRes, property, true);
      while (oldValues.hasMoreElements()) {
        var oldValue = oldValues.getNext().QueryInterface(Ci.nsIRDFNode);
        this._inner.Unassert(targetRes, property, oldValue);
      }
      while (literals.hasMoreElements()) {
        var literal = literals.getNext().QueryInterface(Ci.nsIRDFNode);
        this._inner.Assert(targetRes, property, literal, true);
      }
    }

  },

  /**
   * Copies metadata from an Install Manifest Datasource into the Extensions
   * DataSource.
   * @param   id
   *          The GUID of the item
   * @param   installManifest
   *          The Install Manifest datasource we are copying from
   * @param   installLocation
   *          The Install Location of the item.
   */
  addItemMetadata: function EMDS_addItemMetadata(id, installManifest, installLocation) {
    var targetRes = getResourceForID(id);
    // Remove any temporary assertions used for the install process
    this._setProperty(this._inner, targetRes, EM_R("newVersion"), null);
    // Copy the assertions over from the source datasource.
    // Assert properties with single values
    var singleProps = ["version", "updateURL", "updateService", "optionsURL",
                       "aboutURL", "iconURL", "internalName", "updateKey"];

    // Items installed into restricted Install Locations can also be locked
    // (can't be removed or disabled), and hidden (not shown in the UI)
    if (installLocation.restricted)
      singleProps = singleProps.concat(["locked", "hidden"]);
    if (installLocation.name == KEY_APP_GLOBAL)
      singleProps = singleProps.concat(["appManaged"]);
    for (var i = 0; i < singleProps.length; ++i) {
      var property = EM_R(singleProps[i]);
      var literal = installManifest.GetTarget(gInstallManifestRoot, property, true);
      // If literal is null, _setProperty will remove any existing.
      this._setProperty(this._inner, targetRes, property, literal);
    }

    var localizedProp = EM_R("localized");
    var localeProp = EM_R("locale");
    // Remove old localized properties
    var oldValues = this._inner.GetTargets(targetRes, localizedProp, true);
    while (oldValues.hasMoreElements()) {
      var oldValue = oldValues.getNext().QueryInterface(Ci.nsIRDFNode);
      this._cleanResource(oldValue);
      this._inner.Unassert(targetRes, localizedProp, oldValue);
    }
    // Add each localized property
    var localizations = installManifest.GetTargets(gInstallManifestRoot, localizedProp, true);
    while (localizations.hasMoreElements()) {
      var localization = localizations.getNext().QueryInterface(Ci.nsIRDFResource);
      var anon = gRDF.GetAnonymousResource();
      var literals = installManifest.GetTargets(localization, localeProp, true);
      while (literals.hasMoreElements()) {
        var literal = literals.getNext().QueryInterface(Ci.nsIRDFNode);
        this._inner.Assert(anon, localeProp, literal, true);
      }
      this._addLocalizedMetadata(installManifest, localization, anon);
      this._inner.Assert(targetRes, localizedProp, anon, true);
    }
    // Add the fallback properties
    this._addLocalizedMetadata(installManifest, gInstallManifestRoot, targetRes);

    // Version/Dependency Info
    var versionProps = ["targetApplication", "requires"];
    var idRes = EM_R("id");
    var minVersionRes = EM_R("minVersion");
    var maxVersionRes = EM_R("maxVersion");
    for (var i = 0; i < versionProps.length; ++i) {
      var property = EM_R(versionProps[i]);
      var newVersionInfos = installManifest.GetTargets(gInstallManifestRoot, property, true);

      var oldVersionInfos = this._inner.GetTargets(targetRes, property, true);
      while (oldVersionInfos.hasMoreElements()) {
        var oldVersionInfo = oldVersionInfos.getNext().QueryInterface(Ci.nsIRDFResource);
        this._cleanResource(oldVersionInfo);
        this._inner.Unassert(targetRes, property, oldVersionInfo);
      }
      while (newVersionInfos.hasMoreElements()) {
        var newVersionInfo = newVersionInfos.getNext().QueryInterface(Ci.nsIRDFResource);
        var anon = gRDF.GetAnonymousResource();
        this._inner.Assert(anon, idRes, installManifest.GetTarget(newVersionInfo, idRes, true), true);
        this._inner.Assert(anon, minVersionRes, installManifest.GetTarget(newVersionInfo, minVersionRes, true), true);
        this._inner.Assert(anon, maxVersionRes, installManifest.GetTarget(newVersionInfo, maxVersionRes, true), true);
        this._inner.Assert(targetRes, property, anon, true);
      }
    }
    this.updateProperty(id, "opType");
    this.updateProperty(id, "updateable");
    this.Flush();
  },

  /**
   * Strips an item entry of all assertions.
   * @param   id
   *          The GUID of the item
   */
  removeItemMetadata: function EMDS_removeItemMetadata(id) {
    var item = getResourceForID(id);
    var resources = ["targetApplication", "requires", "localized"];
    for (var i = 0; i < resources.length; ++i) {
      var targetApps = this._inner.GetTargets(item, EM_R(resources[i]), true);
      while (targetApps.hasMoreElements()) {
        var targetApp = targetApps.getNext().QueryInterface(Ci.nsIRDFResource);
        this._cleanResource(targetApp);
      }
    }

    this._cleanResource(item);
  },

  /**
   * Strips a resource of all outbound assertions. We use methods like this
   * since the RDFXMLDatasource will write out all assertions, even if they
   * are not connected through our root.
   * @param   resource
   *          The resource to clean.
   */
  _cleanResource: function EMDS__cleanResource(resource) {
    // Remove outward arcs
    var arcs = this._inner.ArcLabelsOut(resource);
    while (arcs.hasMoreElements()) {
      var arc = arcs.getNext().QueryInterface(Ci.nsIRDFResource);
      var targets = this._inner.GetTargets(resource, arc, true);
      while (targets.hasMoreElements()) {
        var value = targets.getNext().QueryInterface(Ci.nsIRDFNode);
        if (value)
          this._inner.Unassert(resource, arc, value);
      }
    }
  },

  /**
   * Notify views that this propery has changed (this is for properties that
   * are implemented by this datasource rather than by the inner in-memory
   * datasource and thus do not get free change handling).
   * @param   id
   *          The GUID of the item to update the property for.
   * @param   property
   *          The property (less EM_NS) to update.
   */
  updateProperty: function EMDS_updateProperty(id, property) {
    var item = getResourceForID(id);
    this._updateProperty(item, property);
  },

  /**
   * Notify views that this propery has changed (this is for properties that
   * are implemented by this datasource rather than by the inner in-memory
   * datasource and thus do not get free change handling). This allows updating
   * properties for download items which don't have the em item prefix in there
   ( resource value. In most instances updateProperty should be used.
   * @param   item
   *          The item to update the property for.
   * @param   property
   *          The property (less EM_NS) to update.
   */
  _updateProperty: function EMDS__updateProperty(item, property) {
    if (item) {
      var propertyResource = EM_R(property);
      var value = this.GetTarget(item, propertyResource, true);
      for (var i = 0; i < this._observers.length; ++i) {
        if (value)
          this._observers[i].onChange(this, item, propertyResource,
                                      EM_L(""), value);
        else
          this._observers[i].onUnassert(this, item, propertyResource,
                                        EM_L(""));
      }
    }
  },

  /**
   * Move an Item to the index of another item in its container.
   * @param   movingID
   *          The ID of the item to be moved.
   * @param   destinationID
   *          The ID of an item to move another item to.
   */
  moveToIndexOf: function EMDS_moveToIndexOf(movingID, destinationID) {
    var extensions = gRDF.GetResource(RDFURI_ITEM_ROOT);
    var ctr = getContainer(this._inner, extensions);
    var item = gRDF.GetResource(movingID);
    var index = ctr.IndexOf(gRDF.GetResource(destinationID));
    if (index == -1)
      index = 1; // move to the beginning if destinationID is not found
    this._inner.beginUpdateBatch();
    ctr.RemoveElement(item, true);
    ctr.InsertElementAt(item, index, true);
    this._inner.endUpdateBatch();
    this.Flush();
  },

  /**
   * Sorts addons of the specified type by the specified property starting from
   * the top of their container. If the addons are already sorted then no action
   * is performed.
   * @param   type
   *          The nsIUpdateItem type of the items to sort.
   * @param   propertyName
   *          The RDF property name used for sorting.
   * @param   isAscending
   *          true to sort ascending and false to sort descending
   */
  sortTypeByProperty: function EMDS_sortTypeByProperty(type, propertyName, isAscending) {
    var items = [];
    var ctr = getContainer(this._inner, this._itemRoot);
    var elements = ctr.GetElements();
    // Base 0 ordinal for checking against the existing order after sorting
    var ordinal = 0;
    while (elements.hasMoreElements()) {
      var item = elements.getNext().QueryInterface(Ci.nsIRDFResource);
      var id = stripPrefix(item.Value, PREFIX_ITEM_URI);
      var itemType = this.getItemProperty(id, "type");
      if (itemType & type) {
        items.push({ item   : item,
                     ordinal: ordinal,
                     sortkey: this.getItemProperty(id, propertyName) });
        ordinal++;
      }
    }

    var direction = isAscending ? 1 : -1;
    // Locale sensitive sort
    function compare(a, b) {
      return String.localeCompare(a.sortkey, b.sortkey) * direction;
    }
    items.sort(compare);

    // Check if there are any changes in the order of the items
    var isDirty = false;
    for (var i = 0; i < items.length; i++) {
      if (items[i].ordinal != i) {
        isDirty = true;
        break;
      }
    }

    // If there are no changes then early return to avoid the perf impact
    if (!isDirty)
      return;

    // Reorder the items by moving them to the top of the container
    this.beginUpdateBatch();
    for (i = 0; i < items.length; i++) {
      ctr.RemoveElement(items[i].item, true);
      ctr.InsertElementAt(items[i].item, i + 1, true);
    }
    this.endUpdateBatch();
    this.Flush();
  },

  /**
   * Determines if an Item is an active download
   * @param   id
   *          The ID of the item. This will be a uri scheme without the
   *          em item prefix so getProperty shouldn't be used.
   * @returns true if the item is an active download, false otherwise.
   */
  isDownloadItem: function EMDS_isDownloadItem(id) {
    var downloadURL = stringData(this.GetTarget(gRDF.GetResource(id), EM_R("downloadURL"), true));
    return downloadURL && downloadURL != "";
  },

  /**
   * Adds an entry representing an active download to the appropriate container
   * @param   addon
   *          An object implementing nsIUpdateItem for the addon being
   *          downloaded.
   */
  addDownload: function EMDS_addDownload(addon) {
    // Updates have already been added to the datasource so we just update the
    // download state.
    if (addon.id != addon.xpiURL) {
      this.updateDownloadState(PREFIX_ITEM_URI + addon.id, "waiting");
      return;
    }
    var res = gRDF.GetResource(addon.xpiURL);
    this._setProperty(this._inner, res, EM_R("name"), EM_L(addon.name));
    this._setProperty(this._inner, res, EM_R("version"), EM_L(addon.version));
    this._setProperty(this._inner, res, EM_R("iconURL"), EM_L(addon.iconURL));
    this._setProperty(this._inner, res, EM_R("downloadURL"), EM_L(addon.xpiURL));
    this._setProperty(this._inner, res, EM_R("type"), EM_I(addon.type));

    var ctr = getContainer(this._inner, this._itemRoot);
    if (ctr.IndexOf(res) == -1)
      ctr.AppendElement(res);

    this.updateDownloadState(addon.xpiURL, "waiting");
    this.Flush();
  },

  /**
   * Adds an entry representing an item that is incompatible and is being
   * checked for a compatibility update.
   * @param   name
   *          The display name of the item being checked
   * @param   url
   *          The URL string of the xpi file that has been staged.
   * @param   type
   *          The nsIUpdateItem type of the item
   * @param   version
   *          The version of the item
   */
  addIncompatibleUpdateItem: function EMDS_addIncompatibleUpdateItem(name, url, type, version) {
    var iconURL = (type == Ci.nsIUpdateItem.TYPE_THEME) ? URI_GENERIC_ICON_THEME :
                                                          URI_GENERIC_ICON_XPINSTALL;
    var extensionsStrings = BundleManager.getBundle(URI_EXTENSIONS_PROPERTIES);
    var updateMsg = extensionsStrings.formatStringFromName("incompatibleUpdateMessage",
                                                           [BundleManager.appName, name], 2)

    var res = gRDF.GetResource(url);
    this._setProperty(this._inner, res, EM_R("name"), EM_L(name));
    this._setProperty(this._inner, res, EM_R("iconURL"), EM_L(iconURL));
    this._setProperty(this._inner, res, EM_R("downloadURL"), EM_L(url));
    this._setProperty(this._inner, res, EM_R("type"), EM_I(type));
    this._setProperty(this._inner, res, EM_R("version"), EM_L(version));
    this._setProperty(this._inner, res, EM_R("incompatibleUpdate"), EM_L("true"));
    this._setProperty(this._inner, res, EM_R("description"), EM_L(updateMsg));

    var ctr = getContainer(this._inner, this._itemRoot);
    if (ctr.IndexOf(res) == -1)
      ctr.AppendElement(res);

    this.updateDownloadState(url, "incompatibleUpdate");
    this.Flush();
  },

  /**
   * Removes an active download from the appropriate container
   * @param   url
   *          The URL string of the active download to be removed
   */
  removeDownload: function EMDS_removeDownload(url) {
    var res = gRDF.GetResource(url);
    var ctr = getContainer(this._inner, this._itemRoot);
    if (ctr.IndexOf(res) != -1)
      ctr.RemoveElement(res, true);
    this._cleanResource(res);
    this.updateDownloadState(url, null);
    this.Flush();
  },

  /**
   * A hash of RDF resource values (e.g. Add-on IDs or XPI URLs) that represent
   * installation progress for a single browser session.
   */
  _progressData: { },

  /**
   * Updates the install progress data for a given ID (e.g. Add-on IDs or
   * XPI URLs).
   * @param   id
   *          The URL string of the active download to be removed
   * @param   state
   *          The current state in the installation process. If null the object
   *          is deleted from _progressData.
   */
  updateDownloadState: function EMDS_updateDownloadState(id, state) {
    if (!state) {
      if (id in this._progressData)
        delete this._progressData[id];
      return;
    }
    else {
      if (!(id in this._progressData))
        this._progressData[id] = { };
      this._progressData[id].state = state;
    }
    var item = gRDF.GetResource(id);
    this._updateProperty(item, "state");
  },

  updateDownloadProgress: function EMDS_updateDownloadProgress(id, progress) {
    if (!progress) {
      if (!(id in this._progressData))
        return;
      this._progressData[id].progress = null;
    }
    else {
      if (!(id in this._progressData))
        this.updateDownloadState(id, "downloading");

      if (this._progressData[id].progress == progress)
        return;

      this._progressData[id].progress = progress;
    }
    var item = gRDF.GetResource(id);
    this._updateProperty(item, "progress");
  },

  /**
   * A GUID->location-key hash of items that are visible to the application.
   * These are items that show up in the Extension/Themes etc UI. If there is
   * an instance of the same item installed in Install Locations of differing
   * profiles, the item at the highest priority location will appear in this
   * list.
   */
  visibleItems: { },

  /**
   * Walk the list of installed items and determine what the visible list is,
   * based on which items are visible at the highest priority locations.
   */
  _buildVisibleItemList: function EMDS__buildVisibleItemList() {
    var ctr = getContainer(this, this._itemRoot);
    var items = ctr.GetElements();
    while (items.hasMoreElements()) {
      var item = items.getNext().QueryInterface(Ci.nsIRDFResource);
      // Resource URIs adopt the format: location-key,item-id
      var id = stripPrefix(item.Value, PREFIX_ITEM_URI);
      this.visibleItems[id] = this.getItemProperty(id, "installLocation");
    }
  },

  /**
   * Updates an item's location in the visible item list.
   * @param   id
   *          The GUID of the item to update
   * @param   locationKey
   *          The name of the Install Location where the item is installed.
   * @param   forceReplace
   *          true if the new location should be used, regardless of its
   *          priority relationship to existing entries, false if the location
   *          should only be updated if its priority is lower than the existing
   *          value.
   */
  updateVisibleList: function EMDS_updateVisibleList(id, locationKey, forceReplace) {
    if (id in this.visibleItems && this.visibleItems[id]) {
      var oldLocation = InstallLocations.get(this.visibleItems[id]);
      var newLocation = InstallLocations.get(locationKey);
      if (forceReplace || !oldLocation || newLocation.priority < oldLocation.priority)
        this.visibleItems[id] = locationKey;
    }
    else
      this.visibleItems[id] = locationKey;
  },

  /**
   * Load the Extensions Datasource from disk.
   */
  loadExtensions: function EMDS_loadExtensions() {
    var extensionsFile  = getFile(KEY_PROFILEDIR, [FILE_EXTENSIONS]);
    try {
      this._inner = gRDF.GetDataSourceBlocking(getURLSpecFromFile(extensionsFile));
    }
    catch (e) {
      ERROR("Datasource::loadExtensions: removing corrupted extensions datasource " +
            " file = " + extensionsFile.path + ", exception = " + e + "\n");
      extensionsFile.remove(false);
      return;
    }

    var cu = Cc["@mozilla.org/rdf/container-utils;1"].
             getService(Ci.nsIRDFContainerUtils);
    cu.MakeSeq(this._inner, this._itemRoot);

    this._buildVisibleItemList();
  },

  /**
   * See nsIExtensionManager.idl
   */
  onUpdateStarted: function EMDS_onUpdateStarted() {
    LOG("Datasource: Update Started");
  },

  /**
   * See nsIExtensionManager.idl
   */
  onUpdateEnded: function EMDS_onUpdateEnded() {
    LOG("Datasource: Update Ended");
  },

  /**
   * See nsIExtensionManager.idl
   */
  onAddonUpdateStarted: function EMDS_onAddonUpdateStarted(addon) {
    if (!addon)
      throw Cr.NS_ERROR_INVALID_ARG;

    LOG("Datasource: Addon Update Started: " + addon.id);
    this.updateProperty(addon.id, "availableUpdateURL");
  },

  /**
   * See nsIExtensionManager.idl
   */
  onAddonUpdateEnded: function EMDS_onAddonUpdateEnded(addon, status) {
    if (!addon)
      throw Cr.NS_ERROR_INVALID_ARG;

    LOG("Datasource: Addon Update Ended: " + addon.id + ", status: " + status);
    var url = null, hash = null, version = null;
    var updateAvailable = status == Ci.nsIAddonUpdateCheckListener.STATUS_UPDATE;
    if (updateAvailable) {
      url = EM_L(addon.xpiURL);
      if (addon.xpiHash)
        hash = EM_L(addon.xpiHash);
      version = EM_L(addon.version);
    }
    this.setItemProperties(addon.id, {
      availableUpdateURL: url,
      availableUpdateHash: hash,
      availableUpdateVersion: version
    });
    this.updateProperty(addon.id, "availableUpdateURL");
  },

  /////////////////////////////////////////////////////////////////////////////
  // nsIRDFDataSource
  get URI() {
    return "rdf:extensions";
  },

  GetSource: function EMDS_GetSource(property, target, truthValue) {
    return this._inner.GetSource(property, target, truthValue);
  },

  GetSources: function EMDS_GetSources(property, target, truthValue) {
    return this._inner.GetSources(property, target, truthValue);
  },

  /**
   * Gets an URL to a theme's image file
   * @param   item
   *          The RDF Resource representing the item
   * @param   fileName
   *          The file to locate a URL for
   * @param   fallbackURL
   *          If the location fails, supply this URL instead
   * @returns An RDF Resource to the URL discovered, or the fallback
   *          if the discovery failed.
   */
  _getThemeImageURL: function EMDS__getThemeImageURL(item, fileName, fallbackURL) {
    var id = stripPrefix(item.Value, PREFIX_ITEM_URI);
    var installLocation = this._em.getInstallLocation(id);
    if (!installLocation)
      return fallbackURL;
    var file = installLocation.getItemFile(id, fileName)
    if (file.exists())
      return gRDF.GetResource(getURLSpecFromFile(file));

    if (id == stripPrefix(RDFURI_DEFAULT_THEME, PREFIX_ITEM_URI)) {
      var jarFile = getFile(KEY_APPDIR, [DIR_CHROME, FILE_DEFAULT_THEME_JAR]);
      var url = "jar:" + getURLSpecFromFile(jarFile) + "!/" + fileName;
      return gRDF.GetResource(url);
    }

    return fallbackURL ? gRDF.GetResource(fallbackURL) : null;
  },

  /**
   * Get the em:iconURL property (icon url of the item)
   */
  _rdfGet_iconURL: function EMDS__rdfGet_iconURL(item, property) {
    var id = stripPrefix(item.Value, PREFIX_ITEM_URI);
    var type = this.getItemProperty(id, "type");
    if (type & Ci.nsIUpdateItem.TYPE_THEME)
      return this._getThemeImageURL(item, "icon.png", URI_GENERIC_ICON_THEME);

    if (inSafeMode())
      return gRDF.GetResource(URI_GENERIC_ICON_XPINSTALL);

    var hasIconURL = this._inner.hasArcOut(item, property);
    // If the addon doesn't have an IconURL property or it is disabled use the
    // generic icon URL instead.
    if (!hasIconURL || this.getItemProperty(id, "isDisabled") == "true")
      return gRDF.GetResource(URI_GENERIC_ICON_XPINSTALL);
    var iconURL = stringData(this._inner.GetTarget(item, property, true));
    try {
      var uri = newURI(iconURL);
      var scheme = uri.scheme;
      // Only allow chrome URIs or when installing http(s) URIs.
      if (scheme == "chrome" || (scheme == "http" || scheme == "https") &&
          this._inner.hasArcOut(item, EM_R("downloadURL")))
        return null;
    }
    catch (e) {
    }
    // Use a generic icon URL for addons that have an invalid iconURL.
    return gRDF.GetResource(URI_GENERIC_ICON_XPINSTALL);
  },

  /**
   * Get the em:previewImage property (preview image of the item)
   */
  _rdfGet_previewImage: function EMDS__rdfGet_previewImage(item, property) {
    var type = this.getItemProperty(stripPrefix(item.Value, PREFIX_ITEM_URI), "type");
    if (type != -1 && type & Ci.nsIUpdateItem.TYPE_THEME)
      return this._getThemeImageURL(item, "preview.png", null);
    return null;
  },

  /**
   * If we're in safe mode, the item is disabled by the user or app, or the
   * item is to be upgraded force the generic about dialog for the item.
   */
  _rdfGet_aboutURL: function EMDS__rdfGet_aboutURL(item, property) {
    var id = stripPrefix(item.Value, PREFIX_ITEM_URI);
    if (inSafeMode() || this.getItemProperty(id, "isDisabled") == "true" ||
        this.getItemProperty(id, "opType") == OP_NEEDS_UPGRADE)
      return EM_L("");

    return null;
  },

  _rdfGet_installDate: function EMDS__rdfGet_installDate(item, property) {
    var id = stripPrefix(item.Value, PREFIX_ITEM_URI);
    var key = this.getItemProperty(id, "installLocation");
    if (key && key in StartupCache.entries && id in StartupCache.entries[key] &&
        StartupCache.entries[key][id] && StartupCache.entries[key][id].mtime)
      return EM_D(StartupCache.entries[key][id].mtime * 1000000);
    return null;
  },

  /**
   * Get the em:compatible property (whether or not this item is compatible)
   */
  _rdfGet_compatible: function EMDS__rdfGet_compatible(item, property) {
    var id = stripPrefix(item.Value, PREFIX_ITEM_URI);
    var targetAppInfo = this.getTargetApplicationInfo(id, this);
    if (!targetAppInfo) {
      // When installing a new addon targetAppInfo does not exist yet
      if (this.getItemProperty(id, "opType") == OP_NEEDS_INSTALL)
        return EM_L("true");
      return EM_L("false");
    }

    getVersionChecker();
    var appVersion = targetAppInfo.appID == TOOLKIT_ID ? gApp.platformVersion : gApp.version;
    if (gVersionChecker.compare(targetAppInfo.maxVersion, appVersion) < 0 ||
        gVersionChecker.compare(appVersion, targetAppInfo.minVersion) < 0) {
      // OK, this item is incompatible.
      return EM_L("false");
    }
    return EM_L("true");
  },

  /**
   * Get the providesUpdatesSecurely property (whether or not this item has a
   * secure update mechanism)
   */
  _rdfGet_providesUpdatesSecurely: function EMDS__rdfGet_providesUpdatesSecurely(item, property) {
    var id = stripPrefix(item.Value, PREFIX_ITEM_URI);
    if (this.getItemProperty(id, "updateKey") ||
        !this.getItemProperty(id, "updateURL") ||
        this.getItemProperty(id, "updateURL").substring(0, 6) == "https:")
      return EM_L("true");
    return EM_L("false");
  },

  /**
   * Get the em:blocklisted property (whether or not this item is blocklisted)
   */
  _rdfGet_blocklisted: function EMDS__rdfGet_blocklisted(item, property) {
    var id = stripPrefix(item.Value, PREFIX_ITEM_URI);
    var version = this.getItemProperty(id, "version");
    if (!gBlocklist)
      gBlocklist = Cc["@mozilla.org/extensions/blocklist;1"].
                   getService(Ci.nsIBlocklistService);
    if (gBlocklist.getAddonBlocklistState(id, version) == Ci.nsIBlocklistService.STATE_BLOCKED)
      return EM_L("true");

    return EM_L("false");
  },

  /**
   * Get the em:blocklistedsoft property (whether or not this item is listed in the blocklist
   * at a low severity)
   */
  _rdfGet_blocklistedsoft: function EMDS__rdfGet_blocklistedsoft(item, property) {
    var id = stripPrefix(item.Value, PREFIX_ITEM_URI);
    var version = this.getItemProperty(id, "version");
    if (!gBlocklist)
      gBlocklist = Cc["@mozilla.org/extensions/blocklist;1"].
                   getService(Ci.nsIBlocklistService);
    if (gBlocklist.getAddonBlocklistState(id, version) == Ci.nsIBlocklistService.STATE_SOFTBLOCKED)
      return EM_L("true");

    return EM_L("false");
  },

  /**
   * Get the em:state property (represents the current phase of an install).
   */
  _rdfGet_state: function EMDS__rdfGet_state(item, property) {
    var id = item.Value;
    if (id in this._progressData)
      return EM_L(this._progressData[id].state);
    return null;
  },

  /**
   * Get the em:progress property from the _progressData js object. By storing
   * progress which is updated repeastedly during a download we avoid
   * repeastedly writing it to the rdf file.
   */
  _rdfGet_progress: function EMDS__rdfGet_progress(item, property) {
    var id = item.Value;
    if (id in this._progressData)
      return EM_I(this._progressData[id].progress);
    return null;
  },

  /**
   * Get the em:appManaged property. This prevents extensions from hiding
   * extensions installed into locations other than the app-global location.
   */
  _rdfGet_appManaged: function EMDS__rdfGet_appManaged(item, property) {
    var id = stripPrefix(item.Value, PREFIX_ITEM_URI);
    var locationKey = this.getItemProperty(id, "installLocation");
    if (locationKey != KEY_APP_GLOBAL)
      return EM_L("false");
    return null;
  },

  /**
   * Get the em:hidden property. This prevents extensions from hiding
   * extensions installed into locations other than restricted locations.
   */
  _rdfGet_hidden: function EMDS__rdfGet_hidden(item, property) {
    var id = stripPrefix(item.Value, PREFIX_ITEM_URI);
    var installLocation = InstallLocations.get(this.getInstallLocationKey(id));
    if (!installLocation || !installLocation.restricted)
      return EM_L("false");
    return null;
  },

  /**
   * Get the em:locked property. This prevents extensions from locking
   * extensions installed into locations other than restricted locations.
   */
  _rdfGet_locked: function EMDS__rdfGet_locked(item, property) {
    var id = stripPrefix(item.Value, PREFIX_ITEM_URI);
    var installLocation = InstallLocations.get(this.getInstallLocationKey(id));
    if (!installLocation || !installLocation.restricted)
      return EM_L("false");
    return null;
  },

  /**
   * Get the em:satisfiesDependencies property - literal string "false" for
   * dependencies not satisfied (e.g. dependency disabled, incorrect version,
   * not installed etc.), and literal string "true" for dependencies satisfied.
   */
  _rdfGet_satisfiesDependencies: function EMDS__rdfGet_satisfiesDependencies(item, property) {
    var id = stripPrefix(item.Value, PREFIX_ITEM_URI);
    if (this.satisfiesDependencies(id))
      return EM_L("true");
    return EM_L("false");
  },

  /**
   * Get the em:opType property (controls widget state for the EM UI)
   * from the Startup Cache (e.g. extensions.cache)
   */
  _rdfGet_opType: function EMDS__rdfGet_opType(item, property) {
    var id = stripPrefix(item.Value, PREFIX_ITEM_URI);
    var key = this.getItemProperty(id, "installLocation");
    if (key in StartupCache.entries && id in StartupCache.entries[key] &&
        StartupCache.entries[key][id] && StartupCache.entries[key][id].op != OP_NONE)
      return EM_L(StartupCache.entries[key][id].op);
    return null;
  },

  /**
   * Gets a localizable property. Install Manifests are generally only in one
   * language, however an item can customize by providing localized prefs in
   * the form:
   *
   *    extensions.{GUID}.[name|description|creator|homepageURL]
   *
   * to specify localized text for each of these properties.
   */
  _getLocalizablePropertyValue: function EMDS__getLocalizablePropertyValue(item, property) {
    // These are localizable properties that a language pack supplied by the
    // Extension may override.
    var prefName = PREF_EM_EXTENSION_FORMAT.replace(/%UUID%/,
                    stripPrefix(item.Value, PREFIX_ITEM_URI)) +
                    stripPrefix(property.Value, PREFIX_NS_EM);
    try {
      var value = gPref.getComplexValue(prefName,
                                        Ci.nsIPrefLocalizedString);
      if (value.data)
        return EM_L(value.data);
    }
    catch (e) {
    }

    var localized = findClosestLocalizedResource(this._inner, item);
    if (localized) {
      var value = this._inner.GetTarget(localized, property, true);
      return value ? value : EM_L("");
    }
    return null;
  },

  /**
   * Get the em:name property (name of the item)
   */
  _rdfGet_name: function EMDS__rdfGet_name(item, property) {
    return this._getLocalizablePropertyValue(item, property);
  },

  /**
   * Get the em:description property (description of the item)
   */
  _rdfGet_description: function EMDS__rdfGet_description(item, property) {
    return this._getLocalizablePropertyValue(item, property);
  },

  /**
   * Get the em:creator property (creator of the item)
   */
  _rdfGet_creator: function EMDS__rdfGet_creator(item, property) {
    return this._getLocalizablePropertyValue(item, property);
  },

  /**
   * Get the em:homepageURL property (homepage URL of the item)
   */
  _rdfGet_homepageURL: function EMDS__rdfGet_homepageURL(item, property) {
    return this._getLocalizablePropertyValue(item, property);
  },
  
  _rdfGet_availableUpdateInfo: function EMDS__rdfGet_availableUpdateInfo(item, property) {
    var id = stripPrefix(item.Value, PREFIX_ITEM_URI);
    var uri = stringData(this._inner.GetTarget(item, EM_R("availableUpdateInfo"), true));
    if (uri) {
      uri = escapeAddonURI(this.getItemForID(id), null, uri, this);
      return EM_L(uri);
    }
    return null;
  },

  /**
   * Get the em:isDisabled property. This will be true if the item has a
   * appDisabled or a userDisabled property that is true or OP_NEEDS_ENABLE.
   */
  _rdfGet_isDisabled: function EMDS__rdfGet_isDisabled(item, property) {
    var id = stripPrefix(item.Value, PREFIX_ITEM_URI);
    if (this.getItemProperty(id, "userDisabled") == "true" ||
        this.getItemProperty(id, "appDisabled") == "true" ||
        this.getItemProperty(id, "userDisabled") == OP_NEEDS_ENABLE ||
        this.getItemProperty(id, "appDisabled") == OP_NEEDS_ENABLE)
      return EM_L("true");
    return EM_L("false");
  },

  _rdfGet_addonID: function EMDS__rdfGet_addonID(item, property) {
    var id = this._inner.GetTarget(item, EM_R("downloadURL"), true) ? item.Value :
                                                                      stripPrefix(item.Value, PREFIX_ITEM_URI);
    return EM_L(id);
  },

  /**
   * Get the em:updateable property - this specifies whether the item is
   * allowed to be updated
   */
  _rdfGet_updateable: function EMDS__rdfGet_updateable(item, property) {
    var id = stripPrefix(item.Value, PREFIX_ITEM_URI);
    var opType = this.getItemProperty(id, "opType");
    if (opType != OP_NONE || this.getItemProperty(id, "appManaged") == "true")
      return EM_L("false");

    if (getPref("getBoolPref", (PREF_EM_ITEM_UPDATE_ENABLED.replace(/%UUID%/, id), false)) == true)
      return EM_L("false");

    var installLocation = InstallLocations.get(this.getInstallLocationKey(id));
    if (!installLocation || !installLocation.canAccess)
      return EM_L("false");

    return EM_L("true");
  },

  /**
   * See nsIRDFDataSource.idl
   */
  GetTarget: function EMDS_GetTarget(source, property, truthValue) {
    if (!source)
      return null;

    var target = null;
    var getter = "_rdfGet_" + stripPrefix(property.Value, PREFIX_NS_EM);
    if (getter in this)
      target = this[getter](source, property);

    return target || this._inner.GetTarget(source, property, truthValue);
  },

  /**
   * Gets an enumeration of values of a localizable property. Install Manifests
   * are generally only in one language, however an item can customize by
   * providing localized prefs in the form:
   *
   *    extensions.{GUID}.[contributor].1
   *    extensions.{GUID}.[contributor].2
   *    extensions.{GUID}.[contributor].3
   *    ...
   *
   * to specify localized text for each of these properties.
   */
  _getLocalizablePropertyValues: function EMDS__getLocalizablePropertyValues(item, property) {
    // These are localizable properties that a language pack supplied by the
    // Extension may override.
    var values = [];
    var prefName = PREF_EM_EXTENSION_FORMAT.replace(/%UUID%/,
                    stripPrefix(item.Value, PREFIX_ITEM_URI)) +
                    stripPrefix(property.Value, PREFIX_NS_EM);
    var i = 0;
    while (true) {
      try {
        var value = gPref.getComplexValue(prefName + "." + ++i,
                                          Ci.nsIPrefLocalizedString);
        if (value.data)
          values.push(EM_L(value.data));
      }
      catch (e) {
        try {
          var value = gPref.getComplexValue(prefName,
                                            Ci.nsIPrefLocalizedString);
          if (value.data)
            values.push(EM_L(value.data));
        }
        catch (e) {
        }
        break;
      }
    }
    if (values.length > 0)
      return values;

    var localized = findClosestLocalizedResource(this._inner, item);
    if (localized) {
      var targets = this._inner.GetTargets(localized, property, true);
      while (targets.hasMoreElements())
        values.push(targets.getNext());
      return values;
    }
    return null;
  },

  /**
   * Get the em:developer property (developers of the extension)
   */
  _rdfGets_developer: function EMDS__rdfGets_developer(item, property) {
    return this._getLocalizablePropertyValues(item, property);
  },

  /**
   * Get the em:translator property (translators of the extension)
   */
  _rdfGets_translator: function EMDS__rdfGets_translator(item, property) {
    return this._getLocalizablePropertyValues(item, property);
  },

  /**
   * Get the em:contributor property (contributors to the extension)
   */
  _rdfGets_contributor: function EMDS__rdfGets_contributor(item, property) {
    return this._getLocalizablePropertyValues(item, property);
  },

  /**
   * See nsIRDFDataSource.idl
   */
  GetTargets: function EMDS_GetTargets(source, property, truthValue) {
    if (!source)
      return null;

    var ary = null;
    var propertyName = stripPrefix(property.Value, PREFIX_NS_EM);
    var getter = "_rdfGets_" + propertyName;
    if (getter in this)
      ary = this[getter](source, property);
    else {
      // The template builder calls GetTargets when single value properties
      // are used in a triple.
      getter = "_rdfGet_" + propertyName;
      if (getter in this)
        ary = [ this[getter](source, property) ];
    }

    return ary ? new ArrayEnumerator(ary)
               : this._inner.GetTargets(source, property, truthValue);
  },

  Assert: function EMDS_Assert(source, property, target, truthValue) {
    this._inner.Assert(source, property, target, truthValue);
  },

  Unassert: function EMDS_Unassert(source, property, target) {
    this._inner.Unassert(source, property, target);
  },

  Change: function EMDS_Change(source, property, oldTarget, newTarget) {
    this._inner.Change(source, property, oldTarget, newTarget);
  },

  Move: function EMDS_Move(oldSource, newSource, property, target) {
    this._inner.Move(oldSource, newSource, property, target);
  },

  HasAssertion: function EMDS_HasAssertion(source, property, target, truthValue) {
    if (!source || !property || !target)
      return false;

    var getter = "_rdfGet_" + stripPrefix(property.Value, PREFIX_NS_EM);
    if (getter in this)
      return this[getter](source, property) == target;
    return this._inner.HasAssertion(source, property, target, truthValue);
  },

  _observers: [],
  AddObserver: function EMDS_AddObserver(observer) {
    for (var i = 0; i < this._observers.length; ++i) {
      if (this._observers[i] == observer)
        return;
    }
    this._observers.push(observer);
    this._inner.AddObserver(observer);
  },

  RemoveObserver: function EMDS_RemoveObserver(observer) {
    for (var i = 0; i < this._observers.length; ++i) {
      if (this._observers[i] == observer)
        this._observers.splice(i, 1);
    }
    this._inner.RemoveObserver(observer);
  },

  ArcLabelsIn: function EMDS_ArcLabelsIn(node) {
    return this._inner.ArcLabelsIn(node);
  },

  ArcLabelsOut: function EMDS_ArcLabelsOut(source) {
    return this._inner.ArcLabelsOut(source);
  },

  GetAllResources: function EMDS_GetAllResources() {
    return this._inner.GetAllResources();
  },

  IsCommandEnabled: function EMDS_IsCommandEnabled(sources, command, arguments) {
    return this._inner.IsCommandEnabled(sources, command, arguments);
  },

  DoCommand: function EMDS_DoCommand(sources, command, arguments) {
    this._inner.DoCommand(sources, command, arguments);
  },

  GetAllCmds: function EMDS_GetAllCmds(source) {
    return this._inner.GetAllCmds(source);
  },

  hasArcIn: function EMDS_hasArcIn(node, arc) {
    return this._inner.hasArcIn(node, arc);
  },

  hasArcOut: function EMDS_hasArcOut(source, arc) {
    return this._inner.hasArcOut(source, arc);
  },

  beginUpdateBatch: function EMDS_beginUpdateBatch() {
    return this._inner.beginUpdateBatch();
  },

  endUpdateBatch: function EMDS_endUpdateBatch() {
    return this._inner.endUpdateBatch();
  },

  /**
   * See nsIRDFRemoteDataSource.idl
   */
  get loaded() {
    throw Cr.NS_ERROR_NOT_IMPLEMENTED;
  },

  Init: function EMDS_Init(uri) {
  },

  Refresh: function EMDS_Refresh(blocking) {
  },

  Flush: function EMDS_Flush() {
    // For some operations we block repeated flushing until all operations
    // are complete to reduce file accesses that can trigger bug 431065
    if (!gAllowFlush) {
      gDSNeedsFlush = true;
      return;
    }
    if (this._inner instanceof Ci.nsIRDFRemoteDataSource)
      this._inner.Flush();
  },

  FlushTo: function EMDS_FlushTo(uri) {
  },

  classDescription: "Extension Manager Data Source",
  contractID: "@mozilla.org/rdf/datasource;1?name=extensions",
  classID: Components.ID("{69BB8313-2D4F-45EC-97E0-D39DA58ECCE9}"),
  _xpcom_factory: {
    createInstance: function() Cc[ExtensionManager.prototype.contractID].
                               getService(Ci.nsIExtensionManager).datasource
  },
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIRDFDataSource,
                                         Ci.nsIRDFRemoteDataSource])
};

function UpdateItem () {}
UpdateItem.prototype = {
  /**
   * See nsIUpdateService.idl
   */
  init: function(id, version, installLocationKey, minAppVersion, maxAppVersion,
                 name, downloadURL, xpiHash, iconURL, updateURL, updateKey, type,
                 targetAppID) {
    this._id                  = id;
    this._version             = version;
    this._installLocationKey  = installLocationKey;
    this._minAppVersion       = minAppVersion;
    this._maxAppVersion       = maxAppVersion;
    this._name                = name;
    this._downloadURL         = downloadURL;
    this._xpiHash             = xpiHash;
    this._iconURL             = iconURL;
    this._updateURL           = updateURL;
    this._updateKey           = updateKey;
    this._type                = type;
    this._targetAppID         = targetAppID;
  },

  /**
   * See nsIUpdateService.idl
   */
  get id()                { return this._id;                },
  get version()           { return this._version;           },
  get installLocationKey(){ return this._installLocationKey;},
  get minAppVersion()     { return this._minAppVersion;     },
  get maxAppVersion()     { return this._maxAppVersion;     },
  get name()              { return this._name;              },
  get xpiURL()            { return this._downloadURL;       },
  get xpiHash()           { return this._xpiHash;           },
  get iconURL()           { return this._iconURL            },
  get updateRDF()         { return this._updateURL;         },
  get updateKey()         { return this._updateKey;         },
  get type()              { return this._type;              },
  get targetAppID()       { return this._targetAppID;       },

  /**
   * See nsIUpdateService.idl
   */
  get objectSource() {
    return { id                 : this._id,
             version            : this._version,
             installLocationKey : this._installLocationKey,
             minAppVersion      : this._minAppVersion,
             maxAppVersion      : this._maxAppVersion,
             name               : this._name,
             xpiURL             : this._downloadURL,
             xpiHash            : this._xpiHash,
             iconURL            : this._iconURL,
             updateRDF          : this._updateURL,
             updateKey          : this._updateKey,
             type               : this._type,
             targetAppID        : this._targetAppID
           }.toSource();
  },

  classDescription: "Update Item",
  contractID: "@mozilla.org/updates/item;1",
  classID: Components.ID("{F3294B1C-89F4-46F8-98A0-44E1EAE92518}"),
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIUpdateItem])
};

function NSGetModule(compMgr, fileSpec)
  XPCOMUtils.generateModule([ExtensionManager, ExtensionsDataSource, UpdateItem]);

