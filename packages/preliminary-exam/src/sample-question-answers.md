# HTTP

(a) An HTTP request consists of a verb, a path, a protocol version, headers, and a body.

Think of a request as an intent to communicate with another party.

The path specifies what one wants from the recipient: the path to access, e.g. "/rest/customer/1".

The verb specifies our intent, e.g. GET to retrieve some data, POST to upload data, or DELETE to remove data.

The headers contain additional metadata that tell the recipient more about what we want, e.g.
the type of answer we accept (Accept header, JSON, XML, ...) or who we are (Cookie and User-Agent cookie)

The body is the actual message we want to send, e.g. an image to be uploaded.

(b) HTTPS is a secured version of the HTTP protocol. TLS (transport layer security)
is the protocol that implements the secure communication. SSL is its predecessor.
While the name SSL is often still used, SSL itself is not used anymore. Note that
HTTPS is only a transport layer encryption, between the two computers in a network. The
server decrypts the data again. It is not a true end-to-end encryption, where e.g.
in a chat app, only the two parties talking with each other can read the messages,
not the intermediate chat server that facilitates the communication.

(c) 

- Completing or validation a street address entered by a user.
- Implementing a server-side paginator, that only reads and shows the content of the currently selected page, to avoid having to load everything up-front.
- A single page app that retrieves all necessary data from the backend via a REST API.


# HTML

(a) No it's not valid, because the spec clearly defines the allowed values for the autocomplete attribute,
and nowhere does it mention none. It's a common mistake to use "none", which is technically non-compliant.
A reasonable alternative could be "autocomplete=off" or perhaps "autocomplete=new-password".

(b) Nope, also not valid. The spec says that disabled is a boolean attribute, and boolean attributes
do not allow the value "false". It's a mistake sometimes made by people, and the term "boolean" attribute
kind suggests the value can be a boolean. But a boolean attribute as per the spec is just an attribute
that does not have a value, e.g. "<input disabled>" (or "disabled=disabled", if a value is really needed.)

(c) Yup, that's valid. The spec defines the "files" field in the DOM interface as writable, so
it's valid to write a file list to it (regardless of where it comes from, such as from another file input
element) Also, if you look at the WPT (web platform tests), you'll find a test that
covers this exact case (using a file list from another input element).

# Node.JS / NPM

(a) Node.JS lets us run JavaScript on the server, i.e. without a browser. Originally,
JavaScript could only be run in a browser. Node.JS changes that. It can be used for many
purposes, including writing general-purpose programming or Electron Apps. In the context
of web programming, it is often used to run NPM scripts for building frontend resources.
Node.JS can also be used to implement the backend for a webapp, allowing the same programming
language to be used for both the backend and frontend. This reduces the burden of developers
who would otherwise have to be familiar with multiple programming languages; and also enables
code-sharing between the frontend and backend. Also note that nowadays alternative runtimes
such as Deno or bun (WebKit) are available.

(b)

Package managers are now used by many programming languages. Modern programs are complex and
often require many dependencies (3rd party libraries). Having to download and manage these
manually is at best time intensive and error prone. Package managers solve this problem by
automating the management of dependencies and their different version.

NPM can also be used as a simple build system via the "scripts" section in the package.json.

Note that todays there exist alternative package managers such as Yarn or pNpm.

(c) 

The package.json (sometimes called a "manifest") contains the metadata of the package.
Each package (dependency) that is managed by npm has a package.json manifest. It contains
various data, such as the name (ID) of the package and the dependencies of the package.

NPM uses the dependency information to build and resolve a dependency graph, e.g. when it
needs to downloads all dependencies and transitive dependencies for a requested package.

The package.json also contains information about what the package provides, e.g. via
the "exports" section.

Finally, it is also common (albeit arguably bad practice) to include other and non-standard
data in the package.json for specific tools. E.g. some bundlers wanted or still want users
to place build-related data in the package.json.
