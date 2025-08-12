# SEC-TESTER Architecture Document
*BMAD Method: Technical Architecture & Implementation Guide*

## Project: SEC-TESTER (Cyberpunk Security Assessment Platform)

---

## System Overview

SEC-TESTER is a full-stack security assessment platform designed for comprehensive Linux security testing. The architecture follows a modular approach that supports both VM-based remote testing and host-internal security analysis.

## Technical Stack

### Frontend Architecture
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite 4+ for fast development and optimized builds
- **Styling:** Tailwind CSS 3+ with custom cyberpunk art deco theme
- **State Management:** React Context API with custom hooks
- **Real-time Communication:** WebSocket integration for live test updates
- **Routing:** React Router v6 for SPA navigation

### Backend Architecture
- **Framework:** FastAPI (Python 3.10+) for high-performance API
- **ASGI Server:** Uvicorn for production deployment
- **Authentication:** JWT tokens with refresh mechanism
- **WebSocket:** FastAPI native WebSocket support
- **Background Tasks:** Celery with Redis for long-running security tests
- **API Documentation:** Auto-generated OpenAPI/Swagger docs
- **AI Integration:** LiteLLM for multi-provider AI access, Ollama for local models
- **Message Queue:** Redis for AI chat and real-time communication

### Data Layer
- **Primary Database:** PostgreSQL 14+ for structured data
- **Cache Layer:** Redis 6+ for sessions and real-time data
- **File Storage:** Local filesystem with structured directory layout
- **Data Models:** SQLAlchemy ORM with Alembic migrations
- **AI Data:** Conversation history, model configurations, and command audit logs
- **Vector Database:** Chroma/Qdrant for RAG knowledge retrieval and semantic search
- **Knowledge Graph:** Neo4j for CAG relationship mapping and vulnerability correlation
- **Document Store:** Elasticsearch for full-text search and knowledge aggregation

### Infrastructure
- **Python Environment:** Miniconda for dependency management
- **Process Management:** Supervisor for service orchestration
- **Python Environment:** Miniconda for dependency management
- **Process Management:** Supervisor for service orchestration

## AI Integration Architecture

### AI Service Layer

#### LiteLLM Integration
```python
# Multi-provider AI configuration
AI_PROVIDERS = {
    "openai": {
        "api_key": "OPENAI_API_KEY",
        "models": ["gpt-4", "gpt-3.5-turbo"],
        "priority": 1
    },
    "anthropic": {
        "api_key": "ANTHROPIC_API_KEY", 
        "models": ["claude-3-opus", "claude-3-sonnet"],
        "priority": 2
    },
    "ollama": {
        "base_url": "http://localhost:11434",
        "models": ["llama2", "codellama", "mistral"],
        "priority": 3,
        "local": True
    }
}
```

#### AI Service Components
```
backend/
├── ai/
│   ├── __init__.py
│   ├── providers/          # AI provider implementations
│   │   ├── litellm_provider.py    # LiteLLM integration
│   │   ├── ollama_provider.py     # Local Ollama models
│   │   └── provider_manager.py    # Provider selection and fallback
│   ├── chat/              # Chat interface logic
│   │   ├── conversation.py        # Conversation management
│   │   ├── context.py            # Security context tracking
│   │   └── history.py            # Chat history persistence
│   ├── analysis/          # AI-powered analysis
│   │   ├── vulnerability_analyzer.py  # CVE and threat analysis
│   │   ├── result_interpreter.py      # Test output interpretation
│   │   └── risk_assessor.py           # Intelligent risk scoring
│   ├── commands/          # Command execution system
│   │   ├── command_validator.py      # Safety validation
│   │   ├── approval_workflow.py      # Human approval process
│   │   └── sandbox_executor.py       # Safe command execution
│   ├── rag/               # Retrieval-Augmented Generation
│   │   ├── vector_store.py           # Vector database management
│   │   ├── document_processor.py     # Document chunking and embedding
│   │   ├── retriever.py             # Semantic search and retrieval
│   │   └── embeddings.py            # Text embedding generation
│   ├── cag/               # Context-Augmented Generation
│   │   ├── context_manager.py       # Dynamic context building
│   │   ├── relationship_mapper.py    # Entity relationship tracking
│   │   ├── vulnerability_graph.py    # Security knowledge graph
│   │   └── inference_engine.py      # Context-aware reasoning
│   ├── kag/               # Knowledge-Augmented Generation
│   │   ├── knowledge_base.py        # Structured security knowledge
│   │   ├── ontology_manager.py      # Security ontology management
│   │   ├── fact_extractor.py        # Knowledge extraction from results
│   │   └── reasoning_engine.py      # Logical inference and deduction
│   └── models/            # AI data models
│       ├── conversation.py
│       ├── message.py
│       ├── command_log.py
│       ├── knowledge_entity.py
│       └── vulnerability_node.py
```

### AI Data Models

#### Conversation Management
```python
class Conversation:
    id: UUID
    user_id: UUID
    title: str
    created_at: datetime
    updated_at: datetime
    context: JSON  # Security context, current test results, etc.
    model_config: JSON  # AI model preferences
    encrypted: bool = True

class Message:
    id: UUID
    conversation_id: UUID
    role: str  # user, assistant, system
    content: TEXT
    message_type: str  # text, code, command, file_upload
    metadata: JSON  # tokens used, model, execution results
    timestamp: datetime

class CommandExecution:
    id: UUID
    message_id: UUID
    command: str
    status: str  # pending, approved, executed, denied
    approved_by: UUID
    executed_at: datetime
    output: TEXT
    exit_code: int
    risk_level: str

class KnowledgeEntity:
    id: UUID
    entity_type: str  # vulnerability, technique, tool, mitigation
    name: str
    description: TEXT
    properties: JSON
    embeddings: List[float]
    created_at: datetime
    updated_at: datetime

class VulnerabilityNode:
    id: UUID
    cve_id: str
    severity: str
    description: TEXT
    affected_systems: JSON
    relationships: JSON  # Connected entities and their relationships
    knowledge_graph_id: str
    embedding_vector: List[float]
```

### AI Provider Architecture

#### Provider Interface
```python
from abc import ABC, abstractmethod

class AIProvider(ABC):
    @abstractmethod
    async def generate_response(self, messages: List[Message], model: str) -> str:
        pass
    
    @abstractmethod
    async def analyze_security_output(self, test_results: dict) -> dict:
        pass
    
    @abstractmethod
    def get_available_models(self) -> List[str]:
        pass
    
    @abstractmethod
    def estimate_cost(self, input_tokens: int, output_tokens: int) -> float:
        pass
```

#### LiteLLM Provider Implementation
```python
class LiteLLMProvider(AIProvider):
    def __init__(self):
        self.client = LiteLLM()
    
    async def generate_response(self, messages: List[Message], model: str) -> str:
        response = await self.client.acompletion(
            model=model,
            messages=[{"role": m.role, "content": m.content} for m in messages],
            stream=True
        )
        return response
    
    async def analyze_security_output(self, test_results: dict) -> dict:
        # AI-powered analysis of security test results
        analysis_prompt = self._build_analysis_prompt(test_results)
        return await self.generate_response(analysis_prompt, "gpt-4")
```

#### Ollama Local Provider
```python
class OllamaProvider(AIProvider):
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.client = httpx.AsyncClient()
    
    async def generate_response(self, messages: List[Message], model: str) -> str:
        response = await self.client.post(
            f"{self.base_url}/api/generate",
            json={
                "model": model,
                "prompt": self._format_messages(messages),
                "stream": True
            }
        )
        return response
    
    async def pull_model(self, model_name: str) -> bool:
        # Download and manage local models
        response = await self.client.post(
            f"{self.base_url}/api/pull",
            json={"name": model_name}
        )
        return response.status_code == 200
```

### RAG (Retrieval-Augmented Generation) Implementation

#### Vector Store Management
```python
class VectorStore:
    def __init__(self, collection_name: str = "security_knowledge"):
        self.client = chromadb.Client()
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            embedding_function=SentenceTransformerEmbeddings()
        )
    
    async def add_documents(self, documents: List[dict]) -> bool:
        """Add security documents to vector store"""
        texts = [doc["content"] for doc in documents]
        metadatas = [doc["metadata"] for doc in documents]
        ids = [doc["id"] for doc in documents]
        
        self.collection.add(
            documents=texts,
            metadatas=metadatas,
            ids=ids
        )
        return True
    
    async def similarity_search(self, query: str, k: int = 5) -> List[dict]:
        """Retrieve relevant documents for query"""
        results = self.collection.query(
            query_texts=[query],
            n_results=k,
            include=["documents", "metadatas", "distances"]
        )
        
        return [
            {
                "content": doc,
                "metadata": meta,
                "similarity": 1 - dist
            }
            for doc, meta, dist in zip(
                results["documents"][0],
                results["metadatas"][0], 
                results["distances"][0]
            )
        ]

class DocumentProcessor:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
    
    async def process_security_document(self, document: str, doc_type: str) -> List[dict]:
        """Process and chunk security documents for RAG"""
        chunks = self.text_splitter.split_text(document)
        
        processed_chunks = []
        for i, chunk in enumerate(chunks):
            processed_chunks.append({
                "id": f"{doc_type}_{i}",
                "content": chunk,
                "metadata": {
                    "type": doc_type,
                    "chunk_index": i,
                    "source": "security_database"
                }
            })
        
        return processed_chunks

class RAGRetriever:
    def __init__(self, vector_store: VectorStore):
        self.vector_store = vector_store
    
    async def retrieve_security_context(self, query: str, test_results: dict = None) -> str:
        """Retrieve relevant security knowledge for query"""
        # Base retrieval
        relevant_docs = await self.vector_store.similarity_search(query, k=3)
        
        # Context-aware retrieval based on test results
        if test_results:
            context_query = self._build_context_query(test_results)
            context_docs = await self.vector_store.similarity_search(context_query, k=2)
            relevant_docs.extend(context_docs)
        
        # Build context string
        context = "\n\n".join([doc["content"] for doc in relevant_docs])
        return context
    
    def _build_context_query(self, test_results: dict) -> str:
        """Build context-aware query from test results"""
        identified_services = test_results.get("services", [])
        vulnerabilities = test_results.get("vulnerabilities", [])
        
        context_elements = []
        if identified_services:
            context_elements.append(f"services: {', '.join(identified_services)}")
        if vulnerabilities:
            context_elements.append(f"vulnerabilities: {', '.join(vulnerabilities)}")
        
        return " ".join(context_elements)
```

### CAG (Context-Augmented Generation) Implementation

#### Relationship Mapping and Context Management
```python
class RelationshipMapper:
    def __init__(self, neo4j_driver):
        self.driver = neo4j_driver
    
    async def map_vulnerability_relationships(self, cve_id: str) -> dict:
        """Map relationships between vulnerabilities, systems, and mitigations"""
        query = """
        MATCH (v:Vulnerability {cve_id: $cve_id})
        OPTIONAL MATCH (v)-[:AFFECTS]->(s:System)
        OPTIONAL MATCH (v)-[:MITIGATED_BY]->(m:Mitigation)
        OPTIONAL MATCH (v)-[:EXPLOITED_BY]->(t:Technique)
        RETURN v, collect(s) as systems, collect(m) as mitigations, collect(t) as techniques
        """
        
        async with self.driver.session() as session:
            result = await session.run(query, cve_id=cve_id)
            record = await result.single()
            
            return {
                "vulnerability": record["v"],
                "affected_systems": record["systems"],
                "mitigations": record["mitigations"],
                "attack_techniques": record["techniques"]
            }

class ContextManager:
    def __init__(self, relationship_mapper: RelationshipMapper):
        self.relationship_mapper = relationship_mapper
        self.context_cache = {}
    
    async def build_dynamic_context(self, test_results: dict, conversation_history: List[dict]) -> dict:
        """Build dynamic context from test results and conversation"""
        context = {
            "current_test_context": await self._extract_test_context(test_results),
            "conversation_context": self._extract_conversation_context(conversation_history),
            "relationship_context": await self._build_relationship_context(test_results),
            "temporal_context": self._build_temporal_context(test_results)
        }
        
        return context
    
    async def _extract_test_context(self, test_results: dict) -> dict:
        """Extract relevant context from current test results"""
        return {
            "target_system": test_results.get("target"),
            "discovered_services": test_results.get("services", []),
            "identified_vulnerabilities": test_results.get("vulnerabilities", []),
            "risk_level": test_results.get("overall_risk", "unknown"),
            "test_type": test_results.get("test_type", "unknown")
        }
    
    async def _build_relationship_context(self, test_results: dict) -> dict:
        """Build context from vulnerability relationships"""
        relationships = {}
        
        for vuln in test_results.get("vulnerabilities", []):
            if "cve_id" in vuln:
                vuln_relationships = await self.relationship_mapper.map_vulnerability_relationships(
                    vuln["cve_id"]
                )
                relationships[vuln["cve_id"]] = vuln_relationships
        
        return relationships

class VulnerabilityGraph:
    def __init__(self, neo4j_driver):
        self.driver = neo4j_driver
    
    async def create_vulnerability_node(self, cve_data: dict) -> bool:
        """Create vulnerability node in knowledge graph"""
        query = """
        CREATE (v:Vulnerability {
            cve_id: $cve_id,
            severity: $severity,
            description: $description,
            cvss_score: $cvss_score,
            published_date: $published_date
        })
        """
        
        async with self.driver.session() as session:
            await session.run(query, **cve_data)
            return True
    
    async def create_attack_path(self, start_vuln: str, end_target: str, techniques: List[str]) -> bool:
        """Create attack path through vulnerability graph"""
        query = """
        MATCH (start:Vulnerability {cve_id: $start_vuln})
        MATCH (end:System {name: $end_target})
        CREATE (start)-[:LEADS_TO {techniques: $techniques}]->(end)
        """
        
        async with self.driver.session() as session:
            await session.run(query, 
                start_vuln=start_vuln, 
                end_target=end_target, 
                techniques=techniques
            )
            return True
```

### KAG (Knowledge-Augmented Generation) Implementation

#### Knowledge Base and Reasoning Engine
```python
class SecurityKnowledgeBase:
    def __init__(self):
        self.facts = {}
        self.rules = []
        self.ontology = SecurityOntology()
    
    async def add_security_fact(self, fact_type: str, entity: str, properties: dict) -> bool:
        """Add structured security fact to knowledge base"""
        fact_id = f"{fact_type}_{entity}_{hash(str(properties))}"
        
        self.facts[fact_id] = {
            "type": fact_type,
            "entity": entity,
            "properties": properties,
            "confidence": properties.get("confidence", 1.0),
            "source": properties.get("source", "unknown"),
            "timestamp": datetime.utcnow()
        }
        
        return True
    
    async def query_knowledge(self, entity: str, relationship: str = None) -> List[dict]:
        """Query knowledge base for entity information"""
        results = []
        
        for fact_id, fact in self.facts.items():
            if fact["entity"] == entity:
                if not relationship or relationship in fact["properties"]:
                    results.append(fact)
        
        return results
    
    async def infer_security_implications(self, test_results: dict) -> dict:
        """Infer security implications using knowledge base"""
        implications = {
            "direct_threats": [],
            "indirect_risks": [],
            "recommended_actions": [],
            "attack_scenarios": []
        }
        
        # Apply inference rules
        for rule in self.rules:
            if rule.applies_to(test_results):
                rule_result = rule.execute(test_results, self.facts)
                implications[rule.category].extend(rule_result)
        
        return implications

class SecurityOntology:
    def __init__(self):
        self.entities = {
            "vulnerability": ["CVE", "weakness", "exploit"],
            "system": ["operating_system", "service", "application"],
            "technique": ["attack_technique", "exploitation_method"],
            "mitigation": ["patch", "configuration", "control"]
        }
        
        self.relationships = {
            "affects": ["vulnerability", "system"],
            "exploits": ["technique", "vulnerability"],
            "mitigates": ["mitigation", "vulnerability"],
            "requires": ["technique", "system"]
        }
    
    def validate_relationship(self, source_type: str, relationship: str, target_type: str) -> bool:
        """Validate if relationship is ontologically correct"""
        if relationship not in self.relationships:
            return False
        
        expected_types = self.relationships[relationship]
        return source_type in expected_types[0] and target_type in expected_types[1]

class ReasoningEngine:
    def __init__(self, knowledge_base: SecurityKnowledgeBase):
        self.knowledge_base = knowledge_base
        self.inference_rules = self._load_inference_rules()
    
    async def reason_about_security_state(self, test_results: dict) -> dict:
        """Apply logical reasoning to security test results"""
        reasoning_result = {
            "logical_conclusions": [],
            "risk_inferences": [],
            "causal_chains": [],
            "predictive_insights": []
        }
        
        # Apply forward chaining inference
        conclusions = await self._forward_chain_inference(test_results)
        reasoning_result["logical_conclusions"] = conclusions
        
        # Identify causal chains
        causal_chains = await self._identify_causal_chains(test_results)
        reasoning_result["causal_chains"] = causal_chains
        
        # Generate predictive insights
        predictions = await self._generate_predictions(test_results, conclusions)
        reasoning_result["predictive_insights"] = predictions
        
        return reasoning_result
    
    async def _forward_chain_inference(self, test_results: dict) -> List[dict]:
        """Apply forward chaining to derive new conclusions"""
        conclusions = []
        
        for rule in self.inference_rules:
            if rule.condition_met(test_results):
                conclusion = rule.derive_conclusion(test_results)
                conclusions.append({
                    "rule": rule.name,
                    "conclusion": conclusion,
                    "confidence": rule.confidence,
                    "evidence": rule.evidence
                })
        
        return conclusions
    
    def _load_inference_rules(self) -> List['InferenceRule']:
        """Load security-specific inference rules"""
        return [
            InferenceRule(
                name="privilege_escalation_risk",
                condition=lambda results: any(
                    vuln.get("type") == "privilege_escalation" 
                    for vuln in results.get("vulnerabilities", [])
                ),
                conclusion="High risk of privilege escalation attack",
                confidence=0.85
            ),
            InferenceRule(
                name="lateral_movement_potential",
                condition=lambda results: (
                    len(results.get("open_ports", [])) > 10 and
                    any(service.get("authentication") == "weak" 
                        for service in results.get("services", []))
                ),
                conclusion="Potential for lateral movement within network",
                confidence=0.75
            )
        ]

class InferenceRule:
    def __init__(self, name: str, condition: callable, conclusion: str, confidence: float):
        self.name = name
        self.condition = condition
        self.conclusion = conclusion
        self.confidence = confidence
        self.evidence = []
    
    def condition_met(self, test_results: dict) -> bool:
        return self.condition(test_results)
    
    def derive_conclusion(self, test_results: dict) -> str:
        self.evidence = self._extract_evidence(test_results)
        return self.conclusion
    
    def _extract_evidence(self, test_results: dict) -> List[str]:
        # Extract supporting evidence for the conclusion
        return [f"Evidence from {self.name} rule"]
```

### Enhanced AI Provider with RAG/CAG/KAG Integration

```python
class EnhancedAIProvider(AIProvider):
    def __init__(self):
        self.base_provider = LiteLLMProvider()
        self.rag_retriever = RAGRetriever(VectorStore())
        self.context_manager = ContextManager(RelationshipMapper(neo4j_driver))
        self.reasoning_engine = ReasoningEngine(SecurityKnowledgeBase())
    
    async def generate_enhanced_response(self, 
                                       messages: List[Message], 
                                       test_results: dict = None,
                                       conversation_history: List[dict] = None) -> str:
        """Generate response using RAG, CAG, and KAG"""
        
        # RAG: Retrieve relevant knowledge
        query = messages[-1].content
        rag_context = await self.rag_retriever.retrieve_security_context(query, test_results)
        
        # CAG: Build dynamic context
        cag_context = await self.context_manager.build_dynamic_context(
            test_results or {}, 
            conversation_history or []
        )
        
        # KAG: Apply reasoning and knowledge inference
        kag_insights = await self.reasoning_engine.reason_about_security_state(test_results or {})
        
        # Combine all contexts for enhanced prompt
        enhanced_prompt = self._build_enhanced_prompt(
            messages, rag_context, cag_context, kag_insights
        )
        
        return await self.base_provider.generate_response(enhanced_prompt, "gpt-4")
    
    def _build_enhanced_prompt(self, messages: List[Message], 
                             rag_context: str, 
                             cag_context: dict, 
                             kag_insights: dict) -> List[Message]:
        """Build enhanced prompt with all augmentation contexts"""
        system_message = Message(
            role="system",
            content=f"""
            You are a cybersecurity expert with access to comprehensive security knowledge.
            
            RETRIEVED KNOWLEDGE (RAG):
            {rag_context}
            
            CONTEXTUAL RELATIONSHIPS (CAG):
            Current Test Context: {cag_context.get('current_test_context', {})}
            Vulnerability Relationships: {cag_context.get('relationship_context', {})}
            
            REASONING INSIGHTS (KAG):
            Logical Conclusions: {kag_insights.get('logical_conclusions', [])}
            Risk Inferences: {kag_insights.get('risk_inferences', [])}
            Causal Chains: {kag_insights.get('causal_chains', [])}
            
            Provide expert security analysis using this comprehensive context.
            """
        )
        
        return [system_message] + messages

### Security-Specific AI Features

#### Vulnerability Analysis Engine
```python
class VulnerabilityAnalyzer:
    def __init__(self, ai_provider: AIProvider):
        self.ai_provider = ai_provider
        self.cve_database = CVEDatabase()
    
    async def analyze_findings(self, test_results: dict) -> dict:
        # Correlate findings with CVE database
        cve_matches = await self.cve_database.search_vulnerabilities(test_results)
        
        # AI-powered risk assessment
        analysis_prompt = f"""
        Analyze these security test results and provide:
        1. Risk assessment (Critical/High/Medium/Low)
        2. Exploitation difficulty
        3. Business impact
        4. Remediation steps
        
        Test Results: {test_results}
        CVE Matches: {cve_matches}
        """
        
        return await self.ai_provider.generate_response(analysis_prompt, "gpt-4")
```

#### Command Safety System
```python
class CommandValidator:
    DANGEROUS_PATTERNS = [
        r'rm\s+-rf\s+/',
        r'dd\s+if=.*of=/dev/',
        r'mkfs\.',
        r'format\s+c:',
        # Add more dangerous patterns
    ]
    
    def validate_command(self, command: str) -> dict:
        risk_level = "LOW"
        warnings = []
        
        for pattern in self.DANGEROUS_PATTERNS:
            if re.search(pattern, command, re.IGNORECASE):
                risk_level = "CRITICAL"
                warnings.append(f"Potentially destructive pattern: {pattern}")
        
        return {
            "safe": risk_level in ["LOW", "MEDIUM"],
            "risk_level": risk_level,
            "warnings": warnings,
            "requires_approval": risk_level in ["HIGH", "CRITICAL"]
        }
```

## Component Architecture

### Frontend Components

#### AI Chat Interface Components
```
src/
├── components/
│   ├── ai/                 # AI-specific components
│   │   ├── ChatInterface.tsx      # Main chat component
│   │   ├── MessageBubble.tsx      # Individual message display
│   │   ├── CommandApproval.tsx    # Command execution approval
│   │   ├── ModelSelector.tsx      # AI model selection
│   │   ├── ConversationList.tsx   # Chat history sidebar
│   │   └── FileUpload.tsx         # File upload for analysis
│   ├── common/            # Generic components (buttons, modals, etc.)
│   ├── dashboard/         # Dashboard-specific widgets
│   ├── test/             # Test execution components
│   └── security/         # Security-specific UI elements
```

#### AI WebSocket Integration
```typescript
interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type: 'text' | 'code' | 'command' | 'file';
  timestamp: Date;
  metadata?: {
    model: string;
    tokens: number;
    execution_result?: CommandResult;
  };
}

class AIWebSocketService {
  private ws: WebSocket;
  
  sendMessage(message: AIMessage): void {
    this.ws.send(JSON.stringify({
      type: 'ai_message',
      payload: message
    }));
  }
  
  onAIResponse(callback: (message: AIMessage) => void): void {
    this.ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'ai_response') {
        callback(data.payload);
      }
    });
  }
}
```

### Frontend Components

#### Core Application Structure
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (buttons, modals, etc.)
│   ├── dashboard/       # Dashboard-specific widgets
│   ├── test/           # Test execution components
│   └── security/       # Security-specific UI elements
├── pages/              # Route-level page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Network.tsx     # Network reconnaissance
│   ├── Remote.tsx      # Remote assessment
│   ├── Internal.tsx    # Host internal analysis
│   └── Reports.tsx     # Reporting interface
├── hooks/              # Custom React hooks
├── services/           # API client and WebSocket handlers
├── styles/             # Cyberpunk theme and global styles
└── utils/              # Utility functions and helpers
```

#### Design System Components
- **CyberpunkButton:** Neon-styled interactive buttons
- **TerminalOutput:** Matrix-style scrolling text display
- **StatusIndicator:** Glowing status badges and progress bars
- **DataTable:** Sortable tables with cyberpunk styling
- **ChartWidget:** D3.js charts with neon aesthetics
- **ASCIIArt:** Custom ASCII art components for branding

### Backend Components

#### API Structure
```
backend/
├── app/
│   ├── api/            # API route definitions
│   │   ├── v1/         # API version 1 endpoints
│   │   │   ├── tests.py     # Test management endpoints
│   │   │   ├── results.py   # Test results endpoints
│   │   │   ├── reports.py   # Report generation endpoints
│   │   │   └── config.py    # Configuration endpoints
│   │   └── websocket.py     # WebSocket handlers
│   ├── core/           # Core application logic
│   │   ├── config.py   # Application configuration
│   │   ├── security.py # Authentication and authorization
│   │   └── database.py # Database connection and models
│   ├── models/         # SQLAlchemy data models
│   ├── schemas/        # Pydantic request/response schemas
│   ├── services/       # Business logic services
│   └── tests/          # Security test modules
│       ├── network/    # Network reconnaissance tests
│       ├── remote/     # Remote assessment tests
│       ├── internal/   # Host internal analysis tests
│       └── common/     # Shared test utilities
├── requirements.txt    # Python dependencies
└── Dockerfile         # Container definition
```

#### Security Test Engine
- **TestRunner:** Core execution engine for security tests
- **ModuleLoader:** Dynamic loading of security test modules
- **ResultProcessor:** Standardized result parsing and storage
- **OutputStreamer:** Real-time output streaming via WebSocket
- **ReportGenerator:** PDF/HTML report creation

## Security Architecture

### Authentication & Authorization
**Password Security:** Argon2id hashing (recommended for new projects; see OWASP guidance)
- **Encryption in Transit:** TLS 1.3 for all communications
- **Secrets Management:** Environment variables for API keys and database credentials
- **Audit Logging:** Comprehensive security event logging

### Network Security
- **HTTPS Only:** Redirect HTTP to HTTPS in production
- **CORS Configuration:** Strict origin policies for API access
- **Rate Limiting:** API endpoint throttling to prevent abuse
- **Input Validation:** Comprehensive input sanitization and validation

## Data Models

### Core Entities

#### Test Execution Model
```python
class TestExecution:
    id: UUID
    test_type: str  # network, remote, internal
    target: str     # IP address or hostname
    status: str     # pending, running, completed, failed
    started_at: datetime
    completed_at: datetime
    configuration: JSON
    results: JSON
    created_by: User
```

#### Test Results Model
```python
class TestResult:
    id: UUID
    execution_id: UUID
    module_name: str
    status: str
    output: TEXT
    findings: JSON
    risk_level: str  # low, medium, high, critical
    created_at: datetime
```

#### User Management Model
```python
class User:
    id: UUID
    username: str
    email: str
    password_hash: str
    role: str  # admin, analyst, viewer
    is_active: bool
    created_at: datetime
    last_login: datetime
```

## API Design

### REST Endpoints

#### Test Management
- `POST /api/v1/tests/` - Create new test execution
- `GET /api/v1/tests/` - List test executions with filtering
- `GET /api/v1/tests/{test_id}` - Get specific test details
- `DELETE /api/v1/tests/{test_id}` - Cancel/delete test execution

#### Test Results
- `GET /api/v1/results/` - List test results with pagination
- `GET /api/v1/results/{result_id}` - Get specific test result
- `POST /api/v1/results/{result_id}/export` - Export result data

#### Report Generation
- `POST /api/v1/reports/generate` - Create comprehensive report
- `GET /api/v1/reports/{report_id}` - Download generated report
- `GET /api/v1/reports/` - List available reports

#### System Configuration
- `GET /api/v1/config/` - Get system configuration
- `PUT /api/v1/config/` - Update system settings
- `GET /api/v1/config/modules` - List available test modules

#### AI Integration
- `POST /api/v1/ai/chat/` - Send message to AI assistant
- `GET /api/v1/ai/conversations/` - List user conversations
- `POST /api/v1/ai/conversations/` - Create new conversation
- `GET /api/v1/ai/conversations/{conv_id}` - Get conversation history
- `DELETE /api/v1/ai/conversations/{conv_id}` - Delete conversation
- `POST /api/v1/ai/analyze/` - Analyze test results with AI
- `GET /api/v1/ai/models/` - List available AI models
- `POST /api/v1/ai/models/pull` - Download Ollama model
- `POST /api/v1/ai/commands/` - Submit command for approval
- `PUT /api/v1/ai/commands/{cmd_id}/approve` - Approve command execution
- `PUT /api/v1/ai/commands/{cmd_id}/deny` - Deny command execution

#### RAG (Retrieval-Augmented Generation)
- `POST /api/v1/ai/rag/documents/` - Add documents to vector store
- `GET /api/v1/ai/rag/search/` - Semantic search in knowledge base
- `DELETE /api/v1/ai/rag/documents/{doc_id}` - Remove document from vector store
- `POST /api/v1/ai/rag/reindex/` - Rebuild vector embeddings

#### CAG (Context-Augmented Generation)
- `GET /api/v1/ai/cag/context/{test_id}` - Get dynamic context for test
- `POST /api/v1/ai/cag/relationships/` - Create vulnerability relationships
- `GET /api/v1/ai/cag/graph/{entity_id}` - Get entity relationship graph
- `POST /api/v1/ai/cag/inference/` - Perform context-based inference

#### KAG (Knowledge-Augmented Generation)
- `POST /api/v1/ai/kag/facts/` - Add structured security facts
- `GET /api/v1/ai/kag/query/` - Query knowledge base
- `POST /api/v1/ai/kag/reasoning/` - Apply logical reasoning to security data
- `GET /api/v1/ai/kag/ontology/` - Get security ontology structure

### WebSocket Events

#### Client → Server
- `test.start` - Initiate test execution
- `test.cancel` - Cancel running test
- `subscribe.output` - Subscribe to test output stream
- `ai.message` - Send message to AI assistant
- `ai.subscribe` - Subscribe to AI conversation
- `ai.command.submit` - Submit command for execution approval

#### Server → Client
- `test.started` - Test execution began
- `test.progress` - Real-time test output and progress
- `test.completed` - Test finished with summary
- `test.error` - Test execution error
- `system.alert` - Security alerts and notifications
- `ai.response` - AI assistant response (streaming)
- `ai.analysis.complete` - AI analysis of test results complete
- `ai.command.pending` - Command awaiting human approval
- `ai.command.approved` - Command approved for execution
- `ai.command.executed` - Command execution result

## Security Test Modules

### Network Reconnaissance Module
- **Port Scanner:** nmap integration for comprehensive port discovery
- **Service Fingerprinting:** Version detection and OS fingerprinting
- **DNS Enumeration:** Subdomain discovery and zone transfer testing
- **Network Mapping:** Topology discovery and host identification

### Remote Assessment Module
- **Vulnerability Scanner:** Integration with CVE databases
- **SSH Auditing:** Configuration analysis and security testing
- **Web Service Testing:** HTTP/HTTPS service analysis
- **SSL/TLS Analysis:** Certificate and cipher suite evaluation

### Host Internal Analysis Module
- **System Auditing:** Patch status and configuration review
- **User Account Analysis:** Permission and privilege review
- **File System Security:** Permission scanning and integrity checks
- **Process Analysis:** Running service and daemon review
- **Log Analysis:** Security event and anomaly detection

## Deployment Architecture

### Development Environment
- **Hot Reloading:** Vite dev server with React Fast Refresh
- **Hot Reloading:** Vite dev server with React Fast Refresh
- **Database Seeding:** Sample data for development and testing
- **Debug Configuration:** Detailed logging and error reporting

### Production Environment
- **Load Balancing:** Nginx reverse proxy with SSL termination
- **Database Clustering:** PostgreSQL with replication
- **Monitoring:** Prometheus metrics and Grafana dashboards
- **Backup Strategy:** Automated database and configuration backups

### Security Considerations


## Scalability & Performance

### Frontend Optimization
- **Code Splitting:** Route-based and component-based lazy loading
- **Bundle Optimization:** Tree shaking and compression
- **Caching Strategy:** Service worker for static asset caching
- **Progressive Enhancement:** Core functionality works without JavaScript

### Backend Optimization
- **Database Indexing:** Optimized queries for test results and filtering
- **Connection Pooling:** Efficient database connection management
- **Caching Layer:** Redis for frequently accessed data
- **Background Processing:** Asynchronous test execution with Celery

### Monitoring & Observability
- **Application Metrics:** Response times, error rates, throughput
- **Business Metrics:** Test success rates, user engagement, system usage
- **Log Aggregation:** Centralized logging with structured formats
- **Alerting:** Automated alerts for system and security events

## Development Guidelines

### Code Standards
- **TypeScript:** Strict type checking for frontend code
- **Python:** PEP 8 compliance with Black formatting
- **Linting:** ESLint for TypeScript, Flake8 for Python
- **Testing:** Jest for frontend, pytest for backend

### Git Workflow
- **Branch Strategy:** Feature branches with pull request reviews
- **Commit Messages:** Conventional commits for changelog generation
- **Code Review:** Required approvals for production deployments
- **CI/CD:** Automated testing and deployment pipelines

### Documentation
- **API Documentation:** Auto-generated OpenAPI specifications
- **Code Documentation:** Inline comments and docstrings
- **Architecture Decision Records:** Document significant technical decisions
- **User Documentation:** Installation guides and user manuals

---

## Implementation Phases

### Phase 1: Foundation (4-6 weeks)
- Development environment setup
- Basic FastAPI backend with authentication
- React frontend with routing and basic UI
- WebSocket integration for real-time updates

### Phase 2: Core Security Modules (6-8 weeks)
- Network reconnaissance module implementation
- Remote assessment capabilities
- Host internal analysis tools
- Basic reporting and data visualization

### Phase 3: Advanced Features (8+ weeks)
- Cyberpunk UI/UX implementation
- Advanced reporting and export functionality
- Multi-host support and scaling
- Integration with external security tools

This architecture provides a solid foundation for the BMAD development workflow, with clear separation of concerns and modular design that supports iterative development through the SM → Dev → QA cycle.
